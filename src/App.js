import React from "react";
import { Header } from "./components/Header";
import { ModeSelector } from "./components/ModeSelector";
import { StartButton } from "./components/StartButton";
import styles from "./styles/App.module.css";

let App = () => {
  const [selection, setSelection] = React.useState("0");
  const [started, setStarted] = React.useState(false);
  const [discover, setDiscover] = React.useState(null);
  const [permission, setPermission] = React.useState(null);
  const [arp, setArp] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  /**
   * Change the indicator (selection) which indicate which mode user selects
   * @param {int} mode
   */
  let changeSelectionHandler = React.useCallback((mode) => {
    setSelection(mode);
  }, []);

  /**
   * Change the started state
   */
  let changeStartedHandler = React.useCallback(() => {
    setStarted(!started);
  }, [started]);

  /**
   * Being called when component did mount
   */
  React.useEffect(() => {
    const discover = window.Discover();
    const permission = window.Permission();

    let interval = setInterval(() => {
      let res = discover.hasInitialized();
      setLoading(!res);
      if (res === true) {
        clearInterval(interval);
        const Arp = window.Arp(discover.privateIP());
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
      {loading ?
        (
          <div className={styles.loadingContainer}>
            <div className={styles.loading}><div></div><div></div><div></div><div></div></div>
            <p>Fetching gateway and host IP</p>

          </div>
        ) : (
          <React.Fragment>
            <ModeSelector
              changeSelection={changeSelectionHandler}
              selection={selection}
              started={started}
            />
            <hr className={styles.seperator} />
            <StartButton
              selection={selection}
              discover={discover}
              permission={permission}
              arp={arp}
              started={started}
              changeStarted={changeStartedHandler}
            />
          </React.Fragment>
        )
      }
    </div>
  );
};

export default App;
