export interface LoginProps {
  isOpen: boolean;
  closeDialog: () => void;
}

export interface LoginState {
  username: string;
  password: string;
  passwordDialogOpen: boolean;
  accountDialogOpen: boolean;
  loggingIn: boolean;
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface ICredentials {
  accessKeyId: string;
  sessionToken: string;
  secretAccessKey: string;
  identityId: string;
  authenticated: boolean;
}
