import { Theme } from "@material-ui/core";

export interface PasswordInputProps {
  value: string;
  setValue: (e) => void;
  error?: string;
  theme?: Theme;
  small?: boolean;
  label?: string;
  labelWidth?: number;
  placeholder?: string;
}
