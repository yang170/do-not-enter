import React from "react";
import styles from "../styles/StartButton.module.css";

let StartButton = ({
  selection,
  discover,
  permission,
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
        setScanningDone(res);
        if (res === true) {
          clearInterval(interval);
        }
      }, 500);

      switch (selection) {
        case "0":
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
    },
    [discover, permission, changeStarted]
  );

  const handleOnClickStopAttack = React.useCallback(() => {
    changeStarted();
    switch (selection) {
      case "0":
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
  }, [changeStarted, permission, selection]);

  let button;
  if (started && !scanningDone) {
    button = (
      <button className={styles.scan} disabled={true}>
        Scanning
      </button>
    );
  } else if (started && scanningDone) {
    button = (
      <button className={styles.stop} onClick={handleOnClickStopAttack}>
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
