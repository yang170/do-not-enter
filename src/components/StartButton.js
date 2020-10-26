import React from "react";
import styles from "../styles/StartButton.module.css"

let StartButton = ({selection, discover}) => {

    let handleOnClick = React.useCallback((selection) => () => {
        console.log(discover.gatewayIP());
        console.log(discover.privateIP());
        console.log(selection);
        
    }, [discover]);

    return(
        <div className={styles.section}>
            <p className = {styles.label}>Attack</p>
            <button className={styles.start} onClick={handleOnClick(selection)}>Start</button>
        </div>
    );
}

export { StartButton };