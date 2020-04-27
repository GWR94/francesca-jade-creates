import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import {
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  OutlinedInput,
  ThemeProvider,
  FormHelperText,
} from "@material-ui/core";
import { PasswordInputProps } from "./interfaces/PasswordInput.i";

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  setValue,
  error,
  theme,
  small = false,
  label = "Password",
  labelWidth = 60,
  placeholder = "Enter your password...",
}) => {
  const [show, setShow] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <FormControl
        fullWidth
        variant="outlined"
        error={!!error}
        size={small ? "small" : "medium"}
      >
        <InputLabel error={!!error}>{label}</InputLabel>
        <OutlinedInput
          fullWidth
          labelWidth={labelWidth}
          type={show ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          error={!!error}
          color={error ? "secondary" : "primary"}
          onChange={(e): void => setValue(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={(): void => setShow(!show)}
                onMouseDown={(): void => setShow(!show)}
              >
                {show ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText error={!!error}>{error}</FormHelperText>
      </FormControl>
    </ThemeProvider>
  );
};

export default PasswordInput;
