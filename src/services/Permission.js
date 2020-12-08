const sudo = require("sudo-prompt");
const { exec } = require("child_process");

class Permission {
  forwardingEnabled;
  os;
  options;

  constructor() {
    this.forwardingEnabled = false;
    this.os = process.platform;
    this.options = {
      name: "DoNotEnter",
    };
  }

  enableIPForwarding() {
    if (this.os === "win32") {
      sudo.exec(
        'powershell -Command "Set-NetIPInterface -Forwarding Enabled"',
        this.options,
        (error, _stdout, _stderr) => {
          if (error) {
            console.log(error);
          }
          this.forwardingEnabled = true;
        }
      );
    } else if (this.os === "darwin") {
      sudo.exec(
        "sysctl -w net.inet.ip.forwarding=1",
        this.options,
        (error, _stdout, _stderr) => {
          if (error) {
            console.log(error);
          }
          this.forwardingEnabled = true;
        }
      );
    } else {
      sudo.exec(
        "sysctl -w net.ipv4.ip_forward=1",
        this.options,
        (error, _stdout, _stderr) => {
          if (error) {
            console.log(error);
          }
          this.forwardingEnabled = true;
        }
      );
    }
  }

  disableIPForwarding() {
    if (this.os === "win32") {
      sudo.exec(
        'powershell -Command "Set-NetIPInterface -Forwarding Disabled"',
        this.options,
        (error, _stdout, _stderr) => {
          if (error) {
            console.log(error);
          }
          this.forwardingEnabled = false;
        }
      );
    } else if (this.os === "darwin") {
      sudo.exec(
        "sysctl -w net.inet.ip.forwarding=0",
        this.options,
        (error, _stdout, _stderr) => {
          if (error) {
            console.log(error);
          }
          this.forwardingEnabled = false;
        }
      );
    } else {
      // linux
      sudo.exec(
        "sysctl -w net.ipv4.ip_forward=0 && rmmod netfilter_drop_packet",
        this.options,
        (error, _stdout, _stderr) => {
          if (error) {
            console.log(error);
          }
          this.forwardingEnabled = false;
        }
      );
    }
  }

  /**
   * Helper function, set netcap and kernel module for linux
   */
  static linuxSetup() {
    Permission.compileKernelModule();
    exec("python3 --version", (error, stdout, stderr) => {
      if (error) {
        console.log(stderr);
      }
      const pyVersion = stdout.match(/[0-9].[0-9]/g)[0];
      console.log("INFO: python version is " + pyVersion);
      exec("which tcpdump", (error, stdout, stderr) => {
        if (error) {
          console.log(stderr);
        }
        const tcpdumpLocation = stdout;
        console.log("INFO: tcpdump at " + tcpdumpLocation);
        const options = {
          name: "DoNotEnter",
        };
        sudo.exec(
          "setcap cap_net_raw=eip /usr/bin/python" +
            pyVersion +
            " && setcap cap_net_raw=eip " +
            tcpdumpLocation,
          options,
          (error, _stdout, _stderr) => {
            if (error) {
              console.log(error);
            }
          }
        );
      });
    });
  }

  /**
   * Helper function, unset netcap for linux
   */
  static linuxCleanup(callback) {
    Permission.cleanKernelModule();
    exec("python3 --version", (error, stdout, stderr) => {
      if (error) {
        console.log(stderr);
      }
      const pyVersion = stdout.match(/[0-9].[0-9]/g)[0];
      exec("which tcpdump", (error, stdout, stderr) => {
        if (error) {
          console.log(stderr);
        }
        const tcpdumpLocation = stdout;
        const options = {
          name: "DoNotEnter",
        };
        sudo.exec(
          "setcap cap_net_raw=-eip /usr/bin/python" +
            pyVersion +
            " && setcap cap_net_raw=-eip " +
            tcpdumpLocation,
          options,
          (error, _stdout, _stderr) => {
            if (error) {
              console.log(error);
            }
            callback();
          }
        );
      });
    });
  }

  static compileKernelModule() {
    const modulePath = process.cwd() + "/src/services/kernelModule";
    exec("make", { cwd: modulePath }, (error, _stdout, stderr) => {
      if (error) {
        console.log("ERROR: " + stderr);
      }
    });
  }

  static cleanKernelModule() {
    const modulePath = process.cwd() + "/src/services/kernelModule";
    exec("make clean", { cwd: modulePath }, (error, _stdout, stderr) => {
      if (error) {
        console.log("ERROR: " + stderr);
      }
    });
  }

  /**
   * Helper function, get ipforwarding status
   */
  getEnableStatus() {
    return this.forwardingEnabled;
  }
}

module.exports = Permission;
