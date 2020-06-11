import React from "react";
import { CircularProgress } from "@material-ui/core";

interface LoadingProps {
  size?: number;
  color?: "inherit" | "primary" | "secondary";
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
}): JSX.Element => {
  return (
    <div className="loading__container">
      <CircularProgress size={size} color={color} className="loading__spinner" />
    </div>
  );
};

export default Loading;
