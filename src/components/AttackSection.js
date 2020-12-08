import React from "react";
import { DeviceList } from "./DeviceList";

import styles from "../styles/AttackSection.module.css";

let AttackSection = ({
  selection,
  speedLimitPercent,
  discover,
  permission,
  arp,
  attackState,
  changeAttackStateHandler,
  selectedDevices,
  changeSelectedDevicesHandler,
}) => {
  // scan LAN/WALN when component did mount
  React.useEffect(() => {
    discover.scan();
    changeAttackStateHandler("scan");
    let interval = setInterval(() => {
      let res = discover.hasDevicesDiscoveryDone();
      if (res === true) {
        changeAttackStateHandler("stop");
        clearInterval(interval);
      }
    }, 500);
  }, [discover, changeAttackStateHandler]);

  const handleOnClickStartAttack = React.useCallback(
    (selection) => () => {
      changeAttackStateHandler("start");
      if (discover.hasDevicesDiscoveryDone()) {
        switch (selection) {
          case "0":
            console.log(discover.gwMAC);
            selectedDevices.forEach((ip) => {
              console.log("INFO: start kickingout " + ip);
              arp.kickoutStart(ip, discover.gwMAC);
            });
            break;
          case "1":
            console.log(permission.getEnableStatus());
            if (!permission.getEnableStatus()) permission.enableIPForwarding();
            selectedDevices.forEach((ip) => {
              console.log("INFO: start limiting " + ip);
              arp.spyStart(ip, discover.devices.get(ip), discover.gwMAC);
            });
            arp.speedLimitStart(speedLimitPercent, selectedDevices.join(","));
            break;
          case "2":
            if (!permission.getEnableStatus()) permission.enableIPForwarding();
            selectedDevices.forEach((ip) => {
              console.log("INFO: start spying on " + ip);
              arp.spyStart(ip, discover.devices.get(ip), discover.gwMAC);
            });
            break;
          default:
            break;
        }
      }
    },
    [
      discover,
      permission,
      changeAttackStateHandler,
      arp,
      selectedDevices,
      speedLimitPercent,
    ]
  );

  const handleOnClickStopAttack = React.useCallback(
    (selection) => () => {
      changeAttackStateHandler("stop");
      switch (selection) {
        case "0":
          arp.killAttackProcesses();
          break;
        case "1":
          if (permission.getEnableStatus()) permission.disableIPForwarding();
          arp.killAttackProcesses();
          break;
        case "2":
          if (permission.getEnableStatus()) permission.disableIPForwarding();
          arp.killAttackProcesses();
          break;
        default:
          break;
      }
    },
    [changeAttackStateHandler, permission, arp]
  );

  const refreshHandler = React.useCallback(() => {
    discover.clearDevices();
    discover.scan();
    changeAttackStateHandler("scan");
    let interval = setInterval(() => {
      let res = discover.hasDevicesDiscoveryDone();
      if (res === true) {
        changeAttackStateHandler("stop");
        clearInterval(interval);
      }
    }, 500);
  }, [discover, changeAttackStateHandler]);

  let button;
  if (attackState === "scan") {
    button = (
      <button className={styles.scan} disabled={true}>
        Scanning
      </button>
    );
  } else if (attackState === "start") {
    button = (
      <button
        className={styles.stop}
        onClick={handleOnClickStopAttack(selection)}
      >
        Stop
      </button>
    );
  } else {
    button = (
      <button
        className={styles.start}
        onClick={handleOnClickStartAttack(selection)}
      >
        Start
      </button>
    );
  }

  return (
    <div className={styles.section}>
      <p className={styles.label}>Attack</p>
      <DeviceList
        devices={discover.devices}
        selectedDevices={selectedDevices}
        changeSelectedDevicesHandler={changeSelectedDevicesHandler}
        attackState={attackState}
        refreshHandler={refreshHandler}
      />
      {button}
    </div>
  );
};

export { AttackSection };
