import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import {
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  OutlinedInput,
  ThemeProvider,
  Theme,
} from "@material-ui/core";
import clsx from "clsx";

interface Props {
  value: string;
  setValue: (e) => void;
  error?: string;
  theme?: Theme;
}

const PasswordInput: React.FC<Props> = ({ value, setValue, error, theme }) => {
  const [show, setShow] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <FormControl fullWidth variant="outlined" error={!!error}>
        <InputLabel htmlFor="standard-adornment-password" error={!!error}>
          Password
        </InputLabel>
        <OutlinedInput
          id="standard-adornment-password"
          fullWidth
          label="Password"
          labelWidth={60}
          type={show ? "text" : "password"}
          value={value}
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
      </FormControl>
    </ThemeProvider>
  );
};

export default PasswordInput;
