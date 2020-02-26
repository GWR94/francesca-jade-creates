import { CognitoUserProps } from "./Accounts.i";

export interface PasswordProps {
  user: CognitoUserProps;
  closeDialog: () => void;
  open: boolean;
}

export interface PasswordState {
  error: string;
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
  oldPasswordError: string;
  newPasswordError: string;
}
