import React from "react";
import styles from "../styles/ModeSelector.module.css";

let ModeSelector = ({
  changeSelection,
  changeSpeedLimitPercent,
  selection,
  speedLimitPercent,
  started,
}) => {
  const handleModeOnChange = React.useCallback(
    (event) => {
      const mode = event.target.value;
      changeSelection(mode);
    },
    [changeSelection]
  );

  const handleSpeedLimitPercentOnChange = React.useCallback(
    (event) => {
      const newPercent = event.target.value;
      changeSpeedLimitPercent(newPercent);
    },
    [changeSpeedLimitPercent]
  );

  let headsup;
  if (selection !== "0") {
    headsup = (
      <p className={styles.headsup}>
        You will be asked to provide root privilage to enable/disable this mode
      </p>
    );
  }

  let slider;
  if (selection === "1") {
    slider = (
      <React.Fragment>
        <input
          type="range"
          min="0"
          max="100"
          value={speedLimitPercent}
          id="spdLimit"
          onChange={handleSpeedLimitPercentOnChange}
        ></input>
        <p className={styles.text}>
          Reduce victim(s) network access speed by {speedLimitPercent}%
        </p>
      </React.Fragment>
    );
  }

  return (
    <div className={styles.section}>
      <label htmlFor="mode" className={styles.label}>
        Choose a mode
      </label>
      <select
        name="mode"
        className={styles.selector}
        onChange={handleModeOnChange}
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
      {headsup}
      {slider}
    </div>
  );
};

export { ModeSelector };
