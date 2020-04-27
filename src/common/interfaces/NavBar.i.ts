import { History } from "history";
import {
  UserAttributeProps,
  CognitoUserProps,
} from "../../pages/accounts/interfaces/Accounts.i";
import { BasketItemProps } from "../../pages/payment/interfaces/Basket.i";

export interface NavBarProps {
  signOut: () => void;
  setAccountsTab: (tab) => void;
  user: CognitoUserProps;
  userAttributes: UserAttributeProps;
  admin: boolean;
  history: History;
  items: BasketItemProps[];
  removeFromBasket: (itemID: string) => void;
}

export interface NavBarState {
  navOpen: boolean;
  menuOpen: boolean;
  basketOpen: boolean;
  mobile: boolean;
}

export interface NavBarDispatchProps {
  removeFromBasket: (itemID: string) => void;
}

export interface NavBarStateProps {
  items: BasketItemProps[];
}
