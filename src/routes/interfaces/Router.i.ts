import { CognitoUserSession, CognitoUserPool } from "amazon-cognito-identity-js";
import { FetchProductsSuccessAction } from "../../interfaces/products.redux.i";
import { ClearUserAction, SetUserAction } from "../../interfaces/user.redux.i";
import { ClearBasketAction } from "../../interfaces/basket.redux.i";
import {
  CognitoUserProps,
  UserAttributeProps,
} from "../../pages/accounts/interfaces/Accounts.i";
import { ProductProps } from "../../pages/accounts/interfaces/Product.i";

export interface RouterState {
  user: CognitoUserProps | null;
  userAttributes: UserAttributeProps | null;
  isLoading: boolean;
}

export interface RouterDispatchProps {
  setUser: (id: string, admin: boolean) => SetUserAction;
}

export interface RouterProps {
  setUser: (id: string, admin: boolean) => SetUserAction;
}
export interface RouterStateProps {
  sub: string | null;
  products: ProductProps[];
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
