import { Theme, ThemeProviderProps, ThemeOptions } from "@material-ui/core";

export interface PasswordInputProps {
  value: string;
  setValue: (value: string) => void;
  error?: string;
  theme?: any;
  small?: boolean;
  label?: string;
  labelWidth?: number;
  placeholder?: string;
}
