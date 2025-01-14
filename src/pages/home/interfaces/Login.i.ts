export interface LoginProps {
  showButton?: boolean;
  props: {
    variant: "text" | "outlined" | "contained" | undefined;
    classOverride?: string;
    text?: string;
    align?: string;
    color: "inherit" | "default" | "primary" | "secondary" | undefined;
    Icon?: JSX.Element;
  };
  closeNav?: () => void;
}

export interface LoginState {
  username: string;
  password: string;
  passwordDialogOpen: boolean;
  accountDialogOpen: boolean;
  verifyDialogOpen: boolean;
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
