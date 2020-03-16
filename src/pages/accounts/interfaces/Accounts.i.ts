import {
  CognitoUserPool,
  CognitoUserSession,
  ClientMetadata,
} from "amazon-cognito-identity-js";
import { History } from "history";
import { ProductProps } from "../../../common/interfaces/Product.i";

export interface AccountsState {
  products: ProductProps[];
  isLoading: boolean;
  currentTab: "profile" | "products" | "create" | "orders";
}

export interface AccountsProps {
  user: CognitoUserProps;
  userAttributes: UserAttributeProps;
  accountsTab: "profile" | "products" | "create" | "orders";
  admin: boolean;
  history: History;
}

export interface UserAttributeProps {
  sub?: string;
  email_verified?: boolean;
  phone_number_verified?: boolean;
  phone_number?: string;
  email?: string;
  picture?: string;
}

export interface CognitoUserProps {
  username: string;
  pool: CognitoUserPool;
  Session: null;
  client: ClientMetadata;
  signInUserSession: CognitoUserSession;
  authenticationFlowType: string;
  storage: Storage;
  keyPrefix: string;
  userDataKey: string;
  picture?: string;
  attributes: {
    [key: string]: string;
  };
}
