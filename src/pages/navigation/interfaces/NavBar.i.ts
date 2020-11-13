import { BasketItemProps } from "../../payment/interfaces/Basket.i";

export interface NavBarProps {
  signOut: () => void;
  admin: boolean;
  items?: BasketItemProps[];
}

export interface NavbarDispatchProps extends NavBarProps {
  items?: BasketItemProps[];
  removeFromBasket?: (itemID: string) => void;
}
