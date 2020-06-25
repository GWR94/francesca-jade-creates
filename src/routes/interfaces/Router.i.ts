import { SetUserAction } from "../../interfaces/user.redux.i";
import { ClearBasketAction } from "../../interfaces/basket.redux.i";
import {
  CognitoUserProps,
  UserAttributeProps,
  AccountTabTypes,
} from "../../pages/accounts/interfaces/Accounts.i";
import { CognitoUserSession, CognitoUserPool } from "amazon-cognito-identity-js";

export interface RouterState {
  user: CognitoUserProps | null;
  userAttributes: UserAttributeProps | null;
  isLoading: boolean;
  accountsTab: AccountTabTypes;
}

export interface RouterDispatchProps {
  clearBasket: () => ClearBasketAction;
  setUser: (id: string) => SetUserAction;
  clearUser: () => void;
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
