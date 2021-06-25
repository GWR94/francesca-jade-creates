/* eslint-disable react/jsx-no-duplicate-props */ // not actually duplicate
import React from "react";

import TextField from "@material-ui/core/TextField";

interface OutlinedProps {
  label: string;
  labelWidth: number;
  padding: number;
  error?: boolean;
  disabled?: boolean;
}

interface InputProps {
  inputRef: any;
}

const InputComponent: React.FC<InputProps> = ({ inputRef, ...other }) => (
  <div {...other} />
);
const OutlinedContainer: React.FC<OutlinedProps> = ({
  children,
  label,
  disabled,
  error,
}) => {
  return (
    <TextField
      variant="outlined"
      label={label}
      disabled={disabled}
      error={error}
      multiline
      InputLabelProps={{ shrink: true }}
      InputProps={{
        // @ts-expect-error
        inputComponent: InputComponent,
      }}
      inputProps={{ children }}
      fullWidth
    />
  );
};

export default OutlinedContainer;
