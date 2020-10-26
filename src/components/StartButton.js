import React from "react";
import styles from "../styles/StartButton.module.css";

let StartButton = ({ selection, discover, started, changeStarted }) => {
  const [scanningDone, setScanningDone] = React.useState(false);
  const handleOnClickStartAttack = React.useCallback(
    (selection) => () => {
      discover.scan();
      changeStarted();
      let interval = setInterval(() => {
        let res = discover.isDevicesDiscoveryDone();
        setScanningDone(res);
        if (res === true) {
          clearInterval(interval);
        }
      }, 500);
    },
    [discover, changeStarted]
  );

  const handleOnClickStopAttack = React.useCallback(() => {
    changeStarted();
  }, [changeStarted]);

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
