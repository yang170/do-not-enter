import React from "react";
import styles from "../styles/ModeSelector.module.css";

let ModeSelector = ({ changeSelection, started }) => {
  const handleOnChange = React.useCallback(
    (event) => {
      const mode = event.target.value;
      console.log(mode);
      changeSelection(mode);
    },
    [changeSelection]
  );

  return (
    <div className={styles.section}>
      <label htmlFor="mode" className={styles.label}>
        Chose a mode
      </label>
      <select
        name="mode"
        className={styles.selector}
        onChange={handleOnChange}
        disabled={started}
      >
        <option value="0" className={styles.option}>
          Kick other devices out
        </option>
        <option value="1" className={styles.option}>
          Limit other devices' access speed
        </option>
        <option value="2" className={styles.option}>
          Spy on other devices
        </option>
      </select>
    </div>
  );
};

export { ModeSelector };
