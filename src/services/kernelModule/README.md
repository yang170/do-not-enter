# Usage

Use `make` to compile and `make clean` to clean up files

Insert to kernel: `sudo insmod netfilter_drop_packet.ko percent=your_num victimIPs=victim, IPs`

Remove from kernel: `sudo rmmod netfilter_drop_packet`

Check kernel modules: `lsmod`

Display kernel message: `dmesg`