const Discover = require("./Discover.js");
const Permission = require("./Permission.js");
const Arp = require("./Arp.js");

console.log("INFO: preloading");
window.Discover = () => {
  return new Discover();
};

window.Permission = () => {
  return new Permission();
};

window.Arp = (privateIP, gatewayIP) => {
  return new Arp(privateIP, gatewayIP);
};
