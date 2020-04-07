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

export interface RouterDispatchProps {
  clearBasket: () => void;
  setUser: (id) => void;
  clearUser: () => void;
}
