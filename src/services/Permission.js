var sudo = require("sudo-prompt");

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

  removeKernelModule() {}

  getEnableStatus() {
    return this.forwardingEnabled;
  }
}

module.exports = Permission;
