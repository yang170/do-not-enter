const {spawn} = require("child_process");

class Arp {
    privIP;
    gateIP;
    processList;

    constructor(privateIP, gatewayIP){
       this.privIP = privateIP;
       this.gateIP = gatewayIP;
       this.processList = [];
    }
    
    kickoutStart(targetIP, gatewayMAC){
      const cmdPath = "./src/services/kickout.py";
      const proc = spawn("python", [cmdPath, this.gateIP, targetIP, gatewayMAC, "_targetMAC", "0"], {detached: true});
      proc.on("error", (err) => {
        console.log(err);
      });
      console.log(proc.pid);
      this.processList.push(proc.pid);
    }

    kickoutHardStop(){
      for (let i = 0; i < this.processList.length; i++){
        console.log("Info: stopping attack by killing process " + this.processList[i]);
        process.kill(this.processList[i]);
      }
    }

    kickoutStop(targetIP, gatewayMAC, targetMAC){
      const cmdPath = "./src/services/kickout.py";
      const proc = spawn("python", [cmdPath, this.gateIP, targetIP, gatewayMAC, targetMAC, "1"], {detached: true});
      proc.on("error", (err) => {
        console.log(err);
      });
      console.log(proc.pid);
      this.processList.push(proc.pid);
    }

    /**
     * Some routers will block ARP packet when the sender IP address is the same as the router.
     * This method is a walk around of this issue, when this method is called, user can only see
     * the packets send to the target, but not packets send by the target.
     * @param {string} targetIP 
     * @param {string} gatewayMAC 
     */
    spyLimited(targetIP, gatewayMAC){
      this.kickoutStart(targetIP, gatewayMAC);
    }

    
}

module.exports = Arp;
