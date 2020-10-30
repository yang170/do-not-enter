const Cap = require('cap').Cap;

class Arp {
    c;
    device;
    linkType;
    filter;

    constructor(privateIP){
        this.c = new Cap();
        this.device = Cap.findDevice(privateIP);
        this.filter = "arp";
        const bufSize = 10 * 1024 * 1024;
        let buffer = Buffer.alloc(65535);
        this.linkType = this.c.open(this.device, this.filter, bufSize, buffer);
        console.log(this.device);
    }
    
    sendArpTo(targetMAC){

        var buffer = Buffer.from([
            // ETHERNET
            0xff, 0xff, 0xff, 0xff, 0xff,0xff,                  // 0    = Destination MAC
            0x84, 0x8F, 0x69, 0xB7, 0x3D, 0x92,                 // 6    = Source MAC
            0x08, 0x06,                                         // 12   = EtherType = ARP
            // ARP
            0x00, 0x01,                                         // 14/0   = Hardware Type = Ethernet (or wifi)
            0x08, 0x00,                                         // 16/2   = Protocol type = ipv4 (request ipv4 route info)
            0x06, 0x04,                                         // 18/4   = Hardware Addr Len (Ether/MAC = 6), Protocol Addr Len (ipv4 = 4)
            0x00, 0x01,                                         // 20/6   = Operation (ARP, who-has)
            0x84, 0x8f, 0x69, 0xb7, 0x3d, 0x92,                 // 22/8   = Sender Hardware Addr (MAC)
            0xc0, 0xa8, 0x01, 0xc8,                             // 28/14  = Sender Protocol address (ipv4)
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00,                 // 32/18  = Target Hardware Address (Blank/nulls for who-has)
            0xc0, 0xa8, 0x01, 0xc9                              // 38/24  = Target Protocol address (ipv4)
        ]);
        
        try {
          // send will not work if pcap_sendpacket is not supported by underlying `device`
          this.c.send(buffer, buffer.length);
        } catch (e) {
          console.log("Error sending packet:", e);
        }
    }
    
}

module.exports = Arp;
