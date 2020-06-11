import { createMuiTheme } from "@material-ui/core";
import { green } from "@material-ui/core/colors";

export const buttonTheme = createMuiTheme({
  palette: {
    primary: green,
  },
});

export const chipTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#9370f6",
    },
    secondary: {
      main: "#ff80f7",
    },
  },
});
