var sudo = require("sudo-prompt");

class Permission {
  forwardingEnabled;
  os;

  constructor() {
    this.forwardingEnabled = false;
    this.os = process.platform;
    console.log(this.os);
  }

  enableIPForwarding() {
    var options = {
      name: "DoNotEnter",
    };

    if (this.os === "win32") {
      sudo.exec(
        "powershell -Command \"Set-NetIPInterface -Forwarding Enabled\"",
        options,
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
        options,
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
        options,
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
    var options = {
      name: "DoNotEnter",
    };

    if (this.os === "win32") {
      sudo.exec(
        "powershell -Command \"Set-NetIPInterface -Forwarding Disabled\"",
        options,
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
        options,
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
        options,
        (error, _stdout, _stderr) => {
          if (error) {
            console.log(error);
          }
          this.forwardingEnabled = false;
        }
      );
    }
  }

  getEnableStatus() {
    return this.forwardingEnabled;
  }
}

module.exports = Permission;
