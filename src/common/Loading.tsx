import React from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";
import { COLORS } from "../themes";

interface LoadingProps {
  size?: number;
  color?: "inherit" | "primary" | "secondary";
  small?: boolean;
}

/**
 * A component which shows a loading spinner to the user to signal that there is
 * some loading going on.
 * @param {number} size - The size of the loading spinner
 * @param {string} color - The colour of the loading spinner
 */
const Loading: React.FC<LoadingProps> = ({
  size = 100,
  color = "inherit",
  small = false,
}): JSX.Element => {
  const useStyles = makeStyles({
    loading: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "calc(100vh - 60px)",
    },
    loadingSmall: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 60,
    },
    spinner: {
      margin: "0 auto",
      display: "block",
    },
  });
  const classes = useStyles();
  return (
    <div className={small ? classes.loadingSmall : classes.loading}>
      <CircularProgress size={size} color={color} className={classes.spinner} />
    </div>
  );
};

export default Loading;
