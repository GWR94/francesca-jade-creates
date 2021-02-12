import React from "react";
import { makeStyles, Typography, Button, ThemeProvider } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { nonIdealStateTheme } from "../../themes";

interface NonIdealProps {
  title: string;
  Icon: JSX.Element;
  subtext: string;
}

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
  const useStyles = makeStyles({
    nonIdealState: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "center",
      height: 200,
    },
    buttonContainer: {
      display: "inline-flex",
      width: "100%",
      justifyContent: "center",
    },
  });
  const classes = useStyles();
  const history = useHistory();

  return (
    // set the correct theme for the component
    <ThemeProvider theme={nonIdealStateTheme}>
      <div className={classes.nonIdealState}>
        {Icon}
        <Typography variant="h5">{title}</Typography>
        <Typography variant="subtitle2">{subtext}</Typography>
        <div className={classes.buttonContainer}>
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
