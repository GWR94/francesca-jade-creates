import React from "react";
import { CircularProgress } from "@material-ui/core";

interface Props {
  size?: number;
  color?: "inherit" | "primary" | "secondary";
}

const Loading: React.FC<Props> = ({ size = 100, color = "inherit" }): JSX.Element => {
  return (
    <div className="loading__container">
      <CircularProgress size={size} color={color} className="loading__spinner" />
    </div>
  );
};

export default Loading;
