import React from "react";
import { Header } from "./components/Header";
import { ModeSelector } from "./components/ModeSelector";
import { AttackSection } from "./components/AttackSection";
import styles from "./styles/App.module.css";

let App = () => {
  /**
   * Front-end state
   */
  const [selection, setSelection] = React.useState("0");
  const [attackState, setAttackState] = React.useState("scan");
  const [selectedDevices, setSelectedDevices] = React.useState([]);
  // Remote objects to handle searching, os interaction, and ARP attack
  const [discover, setDiscover] = React.useState(null);
  const [permission, setPermission] = React.useState(null);
  const [arp, setArp] = React.useState(null);
  // Loading indicator
  const [loading, setLoading] = React.useState(true);

  /**
   * Change the indicator (selection) which indicate which mode user selects
   * @param {int} mode
   */
  const changeSelectionHandler = React.useCallback((mode) => {
    setSelection(mode);
  }, []);

  /**
   * Change the attack state. Attack has three possible state, they are start, scan, and stop
   */
  const changeAttackStateHandler = React.useCallback((newAttackState) => {
    setAttackState(newAttackState);
  }, []);

  /**
   * Change selected devices in the device table
   */
  const changeSelectedDevicesHandler = React.useCallback(
    (newSelectedDevices) => {
      setSelectedDevices(newSelectedDevices);
    },
    []
  );

  /**
   * Being called when component did mount
   */
  React.useEffect(() => {
    const discover = window.Discover();
    const permission = window.Permission();

    let interval = setInterval(() => {
      let res = discover.hasInitialized();
      if (res === true) {
        setLoading(!res);
        clearInterval(interval);
        const Arp = window.Arp(discover.privateIP(), discover.gatewayIP());
        setArp(Arp);
      }
    }, 500);

    setPermission(permission);
    setDiscover(discover);
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <hr className={styles.seperator} />
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loading}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p>Fetching gateway and host IP</p>
        </div>
      ) : (
        <React.Fragment>
          <ModeSelector
            changeSelection={changeSelectionHandler}
            selection={selection}
            started={attackState === "start"}
          />
          <hr className={styles.seperator} />
          <AttackSection
            selection={selection}
            discover={discover}
            permission={permission}
            arp={arp}
            attackState={attackState}
            changeAttackStateHandler={changeAttackStateHandler}
            selectedDevices={selectedDevices}
            changeSelectedDevicesHandler={changeSelectedDevicesHandler}
          />
        </React.Fragment>
      )}
    </div>
  );
};

export default App;
