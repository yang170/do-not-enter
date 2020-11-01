import { makeStyles } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const useStyles = makeStyles({
  table: {
    maxWidth: "100%",
  },
  checkBox: {
    color: "#2196f3",
  },
  refresh: {
    width: "fit-content",
    color: "#fff",
  },
  refreshText: {
    display: "inline",
  },
  refreshTextDisabled: {
    display: "inline",
    color: "#9e9e9e",
  },
  refreshContainer: {
    color: "#fff",
  },
});

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

export { useStyles, darkTheme };
