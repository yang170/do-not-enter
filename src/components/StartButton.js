import React from "react";
import styles from "../styles/StartButton.module.css"

let StartButton = () => {
    return(
        <div className={styles.section}>
            <p className = {styles.label}>Attack</p>
            <button className={styles.start}>Start</button>
        </div>
    );
}

export { StartButton };