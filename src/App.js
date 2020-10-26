import React from "react";
import {Header} from "./components/Header";
import {ModeSelector} from "./components/ModeSelector";
import {StartButton} from "./components/StartButton";
import styles from './styles/App.module.css';
const {remote} = window.require("electron");
const Discover = remote.require("./services/Discover.js");


let App = () => {
  const [selection, setSelection] = React.useState("0");
  const [discover, setDiscover] = React.useState(null);

  /**
   * Change the indicator (selection) which indicate which mode user selects
   * @param {int} mode 
   */
  let changeSelection = (mode) => {
    setSelection(mode);
  }

  React.useEffect(() => {
    const discover = new Discover();
    setDiscover(discover);
  }, [setDiscover]);

  return (
    <div>
      <Header/>
      <hr className={styles.seperator}/>
      <ModeSelector changeSelection={changeSelection}/>
      <hr className={styles.seperator}/>
      <StartButton selection={selection} discover={discover}/>
    </div>
  );
}

export default App;
