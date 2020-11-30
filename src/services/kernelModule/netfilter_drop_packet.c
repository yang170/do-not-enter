#include <linux/init.h>
#include <linux/module.h>
#include <linux/moduleparam.h>
#include <linux/kernel.h>
#include <linux/netfilter.h>
#include <linux/netfilter_ipv4.h>
#include <linux/ip.h>
#include <linux/random.h>
#include <linux/limits.h>
#define DEBUG 1

static struct nf_hook_ops *nfho = NULL;
static int percent = 100;
static int count = 0;
static char *victimIPs[30];
module_param(percent, int, 0);
module_param_array(victimIPs, charp, &count, 0);

static unsigned int discard_target_packets(void *priv, struct sk_buff *skb, const struct nf_hook_state *state)
{
    struct iphdr *iph;
    int i = 0;
    int rand_num = get_random_int() % 100;
    char sender[16];
    if (!skb)
        return NF_ACCEPT;

    iph = ip_hdr(skb);
    snprintf(sender, 16, "%pI4", &iph->saddr);

    // drop the packet if the packet is from the victim
    for (i = 0; i < count; i++)
    {
        if (strcmp(sender, victimIPs[i]) == 0 && rand_num > percent)
        {
            return NF_DROP;
        }
    }

    if (DEBUG)
    {
        printk(KERN_INFO "current rand num is: %d\n", rand_num);
        printk(KERN_INFO "drop percent: %d\n", percent);
        for (i = 0; i < count; i++)
        {
            printk(KERN_INFO "victim IP: %s\n", victimIPs[i]);
        }
        printk(KERN_INFO "send by: %s\n", sender);
    }

    return NF_ACCEPT;
}

static int __init LKM_init(void)
{
    nfho = (struct nf_hook_ops *)kcalloc(1, sizeof(struct nf_hook_ops), GFP_KERNEL);

    /* Initialize netfilter hook */
    nfho->hook = (nf_hookfn *)discard_target_packets; /* hook function */
    nfho->hooknum = NF_INET_PRE_ROUTING;              /* received packets */
    nfho->pf = PF_INET;                               /* IPv4 */
    nfho->priority = NF_IP_PRI_FIRST;                 /* max hook priority */

    return nf_register_net_hook(&init_net, nfho);
}

static void __exit LKM_exit(void)
{
    nf_unregister_net_hook(&init_net, nfho);
    kfree(nfho);
}

MODULE_AUTHOR("Yang Jiang");
MODULE_LICENSE("GPL");
module_init(LKM_init);
module_exit(LKM_exit);
