export interface PasswordInputProps {
  value: string;
  setValue: (value: string) => void;
  error?: string;
  small?: boolean;
  label?: string;
  labelWidth?: number;
  placeholder?: string;
}
