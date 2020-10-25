import React from "react";
import styles from "../styles/StartButton.module.css"
const {remote} = window.require("electron");

let StartButton = (selection) => {

    let handleOnClick = React.useCallback((selection) => () => {
        const mainProcess = remote.require("./attack/discover.js");
        console.log(selection)
        mainProcess.test();
    }, []);

    return(
        <div className={styles.section}>
            <p className = {styles.label}>Attack</p>
            <button className={styles.start} onClick={handleOnClick(selection)}>Start</button>
        </div>
    );
}

export { StartButton };