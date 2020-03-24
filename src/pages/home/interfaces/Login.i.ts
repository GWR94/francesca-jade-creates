import { History } from "history";

export interface LoginProps {
  history: History;
}

export interface LoginState {
  username: string;
  password: string;
  passwordDialogOpen: boolean;
  accountDialogOpen: boolean;
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface ICredentials {
  accessKeyId: string;
  sessionToken: string;
  secretAccessKey: string;
  identityId: string;
  authenticated: boolean;
}
