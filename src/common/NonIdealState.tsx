import React from "react";
import {
  IconButtonTypeMap,
  makeStyles,
  Typography,
  Button,
  ThemeProvider,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { nonIdealStateTheme } from "../themes";

interface Props {
  title: string;
  Icon: IconButtonTypeMap;
  subText: string;
}

const useStyles = makeStyles({
  nonIdealState: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 200,
  },
});

const NonIdealState = ({ title, Icon, subtext }): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <ThemeProvider theme={nonIdealStateTheme}>
      <div className={classes.nonIdealState}>
        {Icon}
        <Typography variant="h5">{title}</Typography>
        <Typography variant="subtitle2">{subtext}</Typography>
        <div className="dialog__button-container">
          <Button
            color="primary"
            variant="outlined"
            onClick={(): void => history.push("/cakes")}
          >
            Go to Cakes
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            onClick={(): void => history.push("/creates")}
          >
            Go to Creations
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default NonIdealState;
