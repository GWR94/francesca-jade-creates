import {
  CognitoUserPool,
  CognitoUserSession,
  ClientMetadata,
} from "amazon-cognito-identity-js";
import { History } from "history";
import { ProductProps } from "./Product.i";

export type AccountTabTypes = "profile" | "products" | "create" | "orders";

export interface AccountsState {
  products: ProductProps[];
  isLoading: boolean;
  currentTab: AccountTabTypes;
}

export interface AccountsProps {
  user: CognitoUserProps | null;
  userAttributes: UserAttributeProps | null;
  accountsTab: AccountTabTypes;
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
