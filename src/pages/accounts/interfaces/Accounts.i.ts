import {
  CognitoUserPool,
  CognitoUserSession,
  ClientMetadata,
} from "amazon-cognito-identity-js";

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

export interface AccountsPageProps {
  userAttributes: UserAttributeProps | null;
  user: CognitoUserProps;
  admin: boolean;
}

export type CurrentTabTypes =
  | "profile"
  | "create"
  | "products"
  | "orders"
  | "adminOrders";
