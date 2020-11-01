import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import Box from "@material-ui/core/Box";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import RefreshIcon from "@material-ui/icons/Refresh";
import Typography from "@material-ui/core/Typography";
import { useStyles, darkTheme } from "../styles/DeviceListStyle.js";

let DeviceList = ({
  devices,
  selectedDevices,
  changeSelectedDevicesHandler,
  attackState,
  refreshHandler,
}) => {
  const classes = useStyles();

  const handleRowClick = (name) => (_event) => {
    if (selectedDevices.includes(name)) {
      const idx = selectedDevices.indexOf(name);
      selectedDevices.splice(idx, 1);
      changeSelectedDevicesHandler([...selectedDevices]);
    } else {
      selectedDevices.push(name);
      changeSelectedDevicesHandler([...selectedDevices]);
    }

    console.log("INFO: selected devices are " + selectedDevices);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelecteds = mapToObj(devices).map((n) => n.id);
      console.log("INFO: selected devices are " + newSelecteds);
      changeSelectedDevicesHandler(newSelecteds);
      return;
    }
    console.log("INFO: clear selected devices");
    changeSelectedDevicesHandler([]);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedDevices.length > 0 &&
                    selectedDevices.length !== devices.size
                  }
                  checked={selectedDevices.length === devices.size}
                  onClick={handleSelectAll}
                  color="default"
                  className={classes.checkBox}
                />
              </TableCell>
              <TableCell>IP</TableCell>
              <TableCell align="left">MAC</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mapToObj(devices).map((row) => (
              <TableRow key={row.id} onClick={handleRowClick(row.id)}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedDevices.includes(row.id)}
                    color="default"
                    className={classes.checkBox}
                  />
                </TableCell>
                <TableCell align="left">{row.ip}</TableCell>
                <TableCell align="left">{row.mac}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className={classes.refreshContainer}>
        <IconButton
          aria-label="refresh"
          className={classes.refresh}
          onClick={refreshHandler}
          disabled={attackState !== "stop"}
        >
          <RefreshIcon />
        </IconButton>
        <Typography
          variant="body2"
          gutterBottom
          className={
            attackState !== "stop"
              ? classes.refreshTextDisabled
              : classes.refreshText
          }
        >
          re-scan the network
        </Typography>
      </Box>
    </ThemeProvider>
  );
};

const mapToObj = (map) => {
  let res = [];
  map.forEach((value, key) => {
    res.push({ id: key, ip: key, mac: value });
  });
  return res;
};

export { DeviceList };
