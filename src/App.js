import React from "react";
import { Header } from "./components/Header";
import { ModeSelector } from "./components/ModeSelector";
import { StartButton } from "./components/StartButton";
import styles from "./styles/App.module.css";
const { remote } = window.require("electron");
const Discover = remote.require("./services/Discover.js");

let App = () => {
  const [selection, setSelection] = React.useState("0");
  const [started, setStarted] = React.useState(false);
  const [discover, setDiscover] = React.useState(null);

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
    const discover = new Discover();
    setDiscover(discover);
  }, [setDiscover]);

  /**
   * Being called when component did update
   */

  return (
    <div>
      <Header />
      <hr className={styles.seperator} />
      <ModeSelector
        changeSelection={changeSelectionHandler}
        started={started}
      />
      <hr className={styles.seperator} />
      <StartButton
        selection={selection}
        discover={discover}
        started={started}
        changeStarted={changeStartedHandler}
      />
    </div>
  );
};

export default App;
