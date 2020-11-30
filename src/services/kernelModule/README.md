# Usage

Use `make` to compile and `make clean` to clean up files

Insert to kernel: `sudo insmod netfilter_drop_packet.ko percent=your_num victimIPs=victim, IPs`. For example `sudo insmod netfilter_drop_packet.ko percent=10 victimIPs="127.0.0.3","127.0.0.1"`

Remove from kernel: `sudo rmmod netfilter_drop_packet`

Check kernel modules: `lsmod`

Display kernel message: `dmesg`
