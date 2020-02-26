import {
  CognitoUserProps,
  UserAttributeProps,
} from "../../pages/accounts/interfaces/Accounts.i";

export interface RouterState {
  user: CognitoUserProps;
  userAttributes: UserAttributeProps;
  isLoading: boolean;
  accountsTab: "profile" | "products" | "create" | "orders";
}
