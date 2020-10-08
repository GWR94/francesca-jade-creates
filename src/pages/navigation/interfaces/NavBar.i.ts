import { BasketItemProps } from "../../payment/interfaces/Basket.i";

export interface NavBarProps {
  signOut: () => void;
  admin: boolean;
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
  centerImage: boolean;
}
