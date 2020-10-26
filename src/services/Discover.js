var network = require('network');
var childProcess = require('child_process');

class Discover{
    gwIP;
    privIP;
    devices;
    scanCount;

    constructor(){
        this.devices = [];
        this.scanCount = 0;
        
        network.get_gateway_ip((err, ip) => {
            if (!err){
                this.gwIP = ip;
                
                console.log("INFO: Start scanning the network");
                let scanIP = this.gwIP.split(".");
                for (let i = 0; i <= 255; i++){
                    scanIP[3] = i.toString();
                    this.ping(scanIP.join("."));
                }

                console.log(this.devices);
            }else{
                console.log("ERROR: " + err);
            }
        });

        network.get_private_ip((err, ip) => {
            if (!err){
                this.privIP = ip;
            }else{
                console.log("ERROR: " + err);
            }
        })
    }

    gatewayIP(){
        return this.gwIP;
    }

    privateIP(){
        return this.privIP;
    }

    isDevicesDiscoverDone(){
        return this.scanCount >= 254;
    }

    ping(ip){
        const process = childProcess.spawn("ping", ["-c", "1", ip]);
        process.stdout.on("data", (data) => {
            let res = data.toString();
            if (!res.includes("Unreachable")){
                this.devices.push(ip);
                console.log("INFO: " + ip + " is reachable");
            }
            this.scanCount++;
            return;
        })
    }
}

module.exports = Discover;