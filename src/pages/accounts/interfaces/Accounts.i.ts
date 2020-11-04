import {
  CognitoUserPool,
  CognitoUserSession,
  ClientMetadata,
} from "amazon-cognito-identity-js";
import { History } from "history";
import { FetchProductsSuccessAction } from "../../../interfaces/products.redux.i";
import { CurrentTabTypes, SetCurrentTabAction } from "../../../interfaces/user.redux.i";
import { ProductProps } from "./Product.i";

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

export interface AccountsMapState {
  admin: boolean;
  sub: string | null;
  products: ProductProps[];
  currentTab: CurrentTabTypes;
}

export interface AccountsMapProps {
  fetchProductsSuccess: (products: ProductProps[]) => FetchProductsSuccessAction;
  setCurrentTab: (currentTab: CurrentTabTypes) => SetCurrentTabAction;
}

export interface AccountPageProps {
  currentTab?: CurrentTabTypes;
  sub?: string | null;
  userAttributes: UserAttributeProps | null;
  admin: boolean;
  user: CognitoUserProps;
  setCurrentTab?: (tab: CurrentTabTypes) => void;
  history: History;
  products: ProductProps[];
  fetchProductsSuccess?: (products: ProductProps[]) => FetchProductsSuccessAction;
}
