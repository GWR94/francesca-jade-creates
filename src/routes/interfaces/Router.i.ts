import { SetUserAction } from "../../interfaces/user.redux.i";
import { ClearBasketAction } from "../../interfaces/basket.redux.i";
import {
  CognitoUserProps,
  UserAttributeProps,
  AccountTabTypes,
} from "../../pages/accounts/interfaces/Accounts.i";

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
