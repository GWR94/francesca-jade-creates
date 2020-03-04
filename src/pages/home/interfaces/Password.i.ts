export interface PasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface PasswordState {
  codeSent: boolean;
  username: string;
  code: string;
  newPassword: string;
  destination: string;
  codeLoading: boolean;
  verifyLoading: boolean;
}
