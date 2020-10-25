import React from "react";
import {Header} from "./components/Header";
import {ModeSelector} from "./components/ModeSelector";
import {StartButton} from "./components/StartButton";
import styles from './styles/App.module.css';

let App = () => {
  const [selection, setSelection] = React.useState("0");

  /**
   * Change the indicator (selection) which indicate which mode user selects
   * @param {int} mode 
   */
  let changeSelection = (mode) => {
    setSelection(mode);
  }

  return (
    <div>
      <Header/>
      <hr className={styles.seperator}/>
      <ModeSelector changeSelection={changeSelection}/>
      <hr className={styles.seperator}/>
      <StartButton selection={selection}/>
    </div>
  );
}

export default App;
