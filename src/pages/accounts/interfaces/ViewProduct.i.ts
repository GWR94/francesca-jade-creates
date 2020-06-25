import { BasketItemProps } from "../../payment/interfaces/Basket.i";
import { Store } from "redux";
import { UserAttributeProps } from "./Accounts.i";
import { AddItemAction } from "../../../interfaces/basket.redux.i";
import { ProductProps } from "./Product.i";

export interface ViewProps {
  id: string;
  userAttributes: UserAttributeProps | null;
  addToBasket: (product: BasketItemProps) => AddItemAction;
  store?: Store; // test - mock-redux-store
}

export interface ViewState {
  product: ProductProps | null;
}

export interface ViewDispatchProps {
  addToBasket: (product: BasketItemProps) => AddItemAction;
}
