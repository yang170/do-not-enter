var network = require("network");
var childProcess = require("child_process");

class Discover {
  gwIP;
  privIP;
  devices;
  os;
  scanCount;

  constructor() {
    this.devices = [];
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

  getOS() {
    return this.os;
  }

  scan() {
    // do not execute if we've scaned before
    if (this.devices.length === 0) {
      console.log("INFO: start scanning the network");
      let scanIP = this.gwIP.split(".");
      for (let i = 0; i <= 255; i++) {
        scanIP[3] = i.toString();
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
    return (this.gwIP !== undefined) && (this.privIP !== undefined);
  }

  hasDevicesDiscoveryDone() {
    if (this.scanCount === 254) {
      console.log("INFO: device discovery is done");
    }
    return this.scanCount >= 254;
  }

  ping(ip) {
    // use ping library for windows
    if (this.os === "win32") {
      var ping = require("ping");
      ping.sys.probe(ip, (isAlive) => {
        if (isAlive) {
          this.devices.push(ip);
          console.log("INFO: " + ip + " is reachable");
        }
        this.scanCount++;
      });
      // use system call for macOS & ubuntu
    } else {
      let process = childProcess.spawn("ping", ["-c", "1", ip]);
      process.on("exit", (code) => {
        // ping success when return code is 0
        if (code === 0) {
          this.devices.push(ip);
          console.log("INFO: " + ip + " is reachable");
        }
        this.scanCount++;
      });
    }
  }
}

module.exports = Discover;
