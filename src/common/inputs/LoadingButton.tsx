import { Button, CircularProgress, ColorObject } from "@material-ui/core";
import React from "react";

interface LoadingProps {
  isLoading: boolean;
  color: "inherit" | "primary" | "secondary" | "default" | undefined;
  disabled: boolean;
  text: string;
}

const LoadingButton = ({
  isLoading,
  color,
  disabled = false,
  text,
}: LoadingProps): JSX.Element => {
  return (
    <Button disabled={disabled} color={color}>
      {isLoading ? <CircularProgress className={classes.spinner} size={20} /> : text}
    </Button>
  );
};

export default LoadingButton;
