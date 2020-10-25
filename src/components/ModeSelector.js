import React from "react";
import styles from "../styles/ModeSelector.module.css"

let ModeSelector = () => {
    return(
        <div className={styles.section}>
            <label for="mode" className = {styles.label}>Chose a mode</label>
            <select name='mode' className = {styles.selector}>
                <option value="normal" className = {styles.option}>Kick other devices out</option>
                <option value="limit" className = {styles.option}>Limit other devices' access speed</option>
                <option value="advanced" className = {styles.option}>Spy on other devices</option>
            </select>
        </div>
    );
}

export { ModeSelector };