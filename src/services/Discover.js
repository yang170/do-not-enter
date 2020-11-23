const network = require("network");
const { exec } = require("child_process");

class Discover {
  gwIP;
  gwMAC;
  privIP;
  devices;
  os;
  scanCount;

  constructor() {
    this.devices = new Map();
    this.scanCount = 0;
    this.os = process.platform;
    console.log("INFO: os is " + this.os);

    network.get_gateway_ip((err, ip) => {
      if (!err) {
        this.gwIP = ip;
        console.log("INFO: gateway ip is " + ip);
      } else {
        console.log("ERROR: " + err);
      }
    });

    network.get_private_ip((err, ip) => {
      if (!err) {
        this.privIP = ip;
        console.log("INFO: host ip is " + ip);
      } else {
        console.log("ERROR: " + err);
      }
    });
  }

  gatewayIP() {
    return this.gwIP;
  }

  privateIP() {
    return this.privIP;
  }

  clearDevices() {
    this.devices.clear();
  }

  getOS() {
    return this.os;
  }

  scan() {
    // do not execute if we've scaned before
    if (this.devices.size === 0) {
      this.scanCount = 0;
      console.log("INFO: start scanning the network");
      let scanIP = this.gwIP.split(".");
      for (let i = 0; i < 255; i++) {
        scanIP[3] = i.toString();
        // do not put current machine to the device list
        if (scanIP.join(".") !== this.privIP) {
          this.ping(scanIP.join("."));
        }
      }
    } else {
      console.log("INFO: already scanned before");
      console.log(this.devices);
    }
  }

  hasInitialized() {
    return this.gwIP !== undefined && this.privIP !== undefined;
  }

  hasDevicesDiscoveryDone() {
    // 256 - 2 (don't ping gateway & current machine) - 1 (don't ping x.x.x.255)
    if (this.scanCount === 253) {
      console.log("INFO: device discovery is done");
    }
    return this.scanCount >= 253;
  }

  getMac(ip) {
    const cmdPrefix = this.os === "win32" ? "arp -a " : "arp -n ";
    exec(cmdPrefix + ip, (error, stdout, stderr) => {
      if (error) {
        console.log(stderr);
      } else {
        let mac;
        if (this.os === "win32") {
          mac = stdout.match(
            /([a-z0-9]{2}-[a-z0-9]{2}-[a-z0-9]{2}-[a-z0-9]{2}-[a-z0-9]{2}-[a-z0-9]{2})/g
          );
          if (ip === this.gwIP) {
            this.gwMAC = mac[0].replace(/-/g, ":");
          } else {
            this.devices.set(ip, mac[0].replace(/-/g, ":"));
          }
        } else {
          mac = stdout.match(
            /([a-z0-9]+:[a-z0-9]+:[a-z0-9]+:[a-z0-9]+:[a-z0-9]+:[a-z0-9]+)/g
          );
          console.log(mac);
          if (ip === this.gwIP) {
            this.gwMAC = mac[0];
          } else {
            this.devices.set(ip, mac[0]);
          }
        }

        if (ip === this.gwIP) {
          console.log("INFO: " + ip + " : " + this.gwMAC + " is reachable");
        } else {
          console.log(
            "INFO: " + ip + " : " + this.devices.get(ip) + " is reachable"
          );
        }
        this.scanCount++;
      }
    });
  }

  ping(ip) {
    var ping = require("ping");
    ping.sys.probe(ip, (isAlive) => {
      if (isAlive) {
        this.getMac(ip);
      } else {
        this.scanCount++;
      }
    });
  }
}

module.exports = Discover;
