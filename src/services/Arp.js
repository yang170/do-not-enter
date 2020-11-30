const { spawn } = require("child_process");
var sudo = require("sudo-prompt");

class Arp {
  privIP;
  gateIP;
  processList;

  constructor(privateIP, gatewayIP) {
    this.privIP = privateIP;
    this.gateIP = gatewayIP;
    this.processList = [];
  }

  kickoutStart(targetIP, gatewayMAC) {
    const cmdPath = "./src/services/kickout.py";
    const proc = spawn(
      "python3",
      [cmdPath, this.gateIP, targetIP, gatewayMAC, "_targetMAC", "0"],
      { detached: true }
    );
    proc.on("error", (err) => {
      console.log("INFO:" + err);
    });
    console.log("INFP: spawn process " + proc.pid);
    this.processList.push(proc.pid);
  }

  attackHardStop() {
    for (let i = 0; i < this.processList.length; i++) {
      console.log(
        "INFO: stopping attack by killing process " + this.processList[i]
      );
      process.kill(this.processList[i]);
    }
    this.processList = [];
  }

  kickoutStop(targetIP, gatewayMAC, targetMAC) {
    const cmdPath = "./src/services/kickout.py";
    const proc = spawn(
      "python",
      [cmdPath, this.gateIP, targetIP, gatewayMAC, targetMAC, "1"],
      { detached: true }
    );
    proc.on("error", (err) => {
      console.log(err);
    });
    console.log("Process " + proc.pid + "spawned");
    this.processList.push(proc.pid);
  }

  /**
   * Some routers will block ARP packet when the sender IP address is the same as the router.
   * This method is a walk around of this issue, when this method is called, user can only see
   * the packets send to the target, but not packets send by the target.
   * @param {string} targetIP
   * @param {string} gatewayMAC
   */
  spyLimitedStart(targetIP, gatewayMAC) {
    this.kickoutStart(targetIP, gatewayMAC);
  }

  spyStart(targetIP, targetMAC, gatewayMAC) {
    const cmdPath = "./src/services/spy.py";
    const proc = spawn(
      "python3",
      [cmdPath, this.gateIP, targetIP, gatewayMAC, targetMAC, "0"],
      { detached: true }
    );
    proc.on("error", (err) => {
      console.log(err);
    });
    console.log("Process " + proc.pid + "spawned");
    this.processList.push(proc.pid);
  }

  speedLimitStart(
    percent,
    victimIPs,
    targetIP,
    targetMAC,
    gatewayMAC,
    limited
  ) {
    if (limited) {
      this.spyLimitedStart(targetIP, gatewayMAC);
    } else {
      this.spyLimited(targetIP, targetMAC, gatewayMAC);
    }

    if (process.platform === "linux") {
      const modulePath = "./kernelModule/netfilter_drop_packet.ko";
      const cmd =
        "inmod " +
        modulePath +
        " percent=" +
        percent +
        " victimIP=" +
        victimIPs;
      const options = {
        name: "DoNotEnter",
      };
      console.log("INFO: insert module command is: " + cmd);
      // insert the kernel module
      sudo.exec(cmd, options, (error, _stdout, _stderr) => {
        if (error) {
          console.log(error);
        }
      });
    }
  }

  speedLimitStop() {
    const options = {
      name: "DoNotEnter",
    };
    if (process.platform === "linux") {
      sudo.exec(
        "rmmod netfilter_drop_packet",
        options,
        (error, _stdout, _stderr) => {
          if (error) {
            console.log(error);
          }
        }
      );
    }
  }
}

module.exports = Arp;
