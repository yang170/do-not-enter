const network = require("network");
const {exec} = require("child_process");

class Discover {
  gwIP;
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

  getMAC(ip){
    let res;
    if (this.devices.size !== 0){
      res = this.devices.get(ip);
    }else{
      res = "ff:ff:ff:ff:ff:ff"
    }
    return res;
  }

  getOS() {
    return this.os;
  }

  scan() {
    // do not execute if we've scaned before
    if (this.devices.size === 0) {
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

  getMac(ip){
    return exec("arp -a " + ip, (error, stdout, stderr) => {
      if (error){
        console.log(stderr);
      }else{
        const mac = stdout.match(/([a-z0-9]{2}-[a-z0-9]{2}-[a-z0-9]{2}-[a-z0-9]{2}-[a-z0-9]{2}-[a-z0-9]{2})/g);
        this.devices.set(ip, mac[0].replace(/-/g, ':'));
        console.log("INFO: " + ip + " : " + this.devices.get(ip) + " is reachable");
        this.scanCount++;
      }
    });
  }

  ping(ip) {
    // use ping library for windows
    if (this.os === "win32") {
      var ping = require("ping");
      ping.sys.probe(ip, (isAlive) => {
        if (isAlive) {
          this.getMac(ip);
        }else{
          this.scanCount++;
        }
      });
    }
  }
}

module.exports = Discover;
