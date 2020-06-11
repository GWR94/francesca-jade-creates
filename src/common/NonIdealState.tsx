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

interface NonIdealProps {
  title: string;
  Icon: IconButtonTypeMap;
  subtext: string;
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

/**
 * A component which shows the user that there is no data found where it possibly
 * should have been. For example, when the basket is empty there will be a non-ideal
 * state component saying that there is nothing in the basket, alongside ways to
 * rectify this.
 * @param {string} title - The title of the non-ideal state component
 * @param {Icon} Icon - The icon that is displayed in the top left of the component
 * @param {string} subtext - The description of the non-ideal component.
 */
const NonIdealState: React.SFC<NonIdealProps> = ({
  title,
  Icon,
  subtext,
}): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();

  return (
    // set the correct theme for the component
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
