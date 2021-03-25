import { CognitoUserSession, CognitoUserPool } from "amazon-cognito-identity-js";
import { SetUserAction } from "../../interfaces/user.redux.i";
import {
  CognitoUserProps,
  UserAttributeProps,
} from "../../pages/accounts/interfaces/Accounts.i";

export interface RouterState {
  user: CognitoUserProps | null;
  userAttributes: UserAttributeProps | null;
  isLoading: boolean;
}

export interface RouterProps {
  setUser: (id: string, admin: boolean) => SetUserAction;
}
export interface SignInUserData {
  Session: CognitoUserSession;
  authenticationFlorType: string;
  client: ClientData;
  keyPrefix: string;
  pool: CognitoUserPool;
  storage: Storage;
  userDataKey: string;
  username: string;
  attributes?: {
    sub: string;
  };
  email: string;
  id: string;
  signInUserSession: {
    idToken: {
      payload: {
        sub: string;
        email: string;
      };
    };
  };
}

export interface HubCapsule {
  payload: {
    event: string;
    data: SignInUserData;
  };
}
