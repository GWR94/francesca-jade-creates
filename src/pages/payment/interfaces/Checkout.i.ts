import { UserAttributeProps } from "../../accounts/interfaces/Accounts.i";
import { BasketItemProps } from "./Basket.i";

export interface CheckoutProps {
  paymentProps?: {
    items: BasketItemProps[];
    cost: number;
  };
  items?: BasketItemProps[];
  cost?: number;
  userAttributes: UserAttributeProps;
}
