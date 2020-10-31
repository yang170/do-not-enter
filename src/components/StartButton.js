import React from "react";
import styles from "../styles/StartButton.module.css";

let StartButton = ({
  selection,
  discover,
  permission,
  arp,
  started,
  changeStarted,
}) => {
  const [scanningDone, setScanningDone] = React.useState(false);
  const handleOnClickStartAttack = React.useCallback(
    (selection) => () => {
      discover.scan();
      changeStarted();
      let interval = setInterval(() => {
        let res = discover.hasDevicesDiscoveryDone();
        if (res === true) {
          setScanningDone(res);
          clearInterval(interval);
          switch (selection) {
            case "0":
              const targetIP = "192.168.3.13"
              const gatewayMAC = discover.getMAC(discover.gatewayIP());
              arp.kickoutStart(targetIP, gatewayMAC);
              break;
            case "1":
              console.log(permission.getEnableStatus());
              if (!permission.getEnableStatus()) permission.enableIPForwarding();
              break;
            case "2":
              if (!permission.getEnableStatus()) permission.enableIPForwarding();
              break;
            default:
              break;
          }
        }
      }, 500);
    },
    [discover, permission, changeStarted, arp]
  );

  const handleOnClickStopAttack = React.useCallback((selection) => () => {
    changeStarted();
    switch (selection) {
      case "0":
        arp.kickoutHardStop();
        break;
      case "1":
        if (permission.getEnableStatus()) permission.disableIPForwarding();
        break;
      case "2":
        if (permission.getEnableStatus()) permission.disableIPForwarding();
        break;
      default:
        break;
    }
  }, [changeStarted, permission, arp]);

  let button;
  if (started && !scanningDone) {
    button = (
      <button className={styles.scan} disabled={true}>
        Scanning
      </button>
    );
  } else if (started && scanningDone) {
    button = (
      <button className={styles.stop} onClick={handleOnClickStopAttack(selection)}>
        Stop
      </button>
    );
  } else if (!started) {
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
      {button}
    </div>
  );
};

export { StartButton };
