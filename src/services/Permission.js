var sudo = require("sudo-prompt");
var { exec } = require("child_process");

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
      sudo.exec(
        "sysctl -w net.ipv4.ip_forward=0",
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
   * Helper function, set netcap for linux
   */
  static setNetCap() {
    if (process.platform === "linux") {
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
    } else {
      console.log("ERROR: other platforms does not require set/unset netcap");
    }
  }

  /**
   * Helper function, unset netcap for linux
   */
  static unsetNetcap(callback) {
    if (process.platform === "linux") {
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
    } else {
      console.log("ERROR: other platforms does not require set/unset netcap");
    }
  }

  removeKernelModule() {}

  /**
   * Helper function, get ipforwarding status
   */
  getEnableStatus() {
    return this.forwardingEnabled;
  }
}

module.exports = Permission;
