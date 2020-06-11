import { History } from "history";
import {
  UserAttributeProps,
  CognitoUserProps,
  AccountTabTypes,
} from "../../accounts/interfaces/Accounts.i";
import { BasketItemProps } from "../../payment/interfaces/Basket.i";

export interface NavBarProps {
  signOut: () => void;
  setAccountsTab: (tab: AccountTabTypes) => void;
  user: CognitoUserProps | null;
  userAttributes: UserAttributeProps | null;
  admin: boolean;
  history: History;
  items?: BasketItemProps[];
  // removeFromBasket: (itemID: string) => void;
  classes: {
    [key: string]: string;
  };
}

export interface NavbarDispatchProps extends NavBarProps {
  items?: BasketItemProps[];
  removeFromBasket?: (itemID: string) => void;
}

export interface NavBarState {
  navOpen: boolean;
  mobile: boolean;
}
