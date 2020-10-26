var network = require('network');
var childProcess = require('child_process');

class Discover{
    gwIP;
    privIP;
    devices;

    constructor(){
        this.devices = [];
        
        network.get_gateway_ip((err, ip) => {
            if (!err){
                this.gwIP = ip;

                let scanIP = this.gwIP.split(".");
                for (let i = 0; i < 255; i++){
                    scanIP[3] = i.toString();
                    console.log("Pingning " + scanIP);
                    this.ping(scanIP.join());
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

    ping(ip){
        const process = childProcess.spawn("ping", ["-c", "1", ip]);
        process.stdout.on("data", (data) => {
            let res = data.toString();
            if (!res.includes("Unreachable")){
                this.devices.push(ip);
            }
            return;
        })
    }
}

module.exports = Discover;