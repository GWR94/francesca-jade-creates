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
