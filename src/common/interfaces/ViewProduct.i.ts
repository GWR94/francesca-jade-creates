import { Store } from "redux";
import { UserAttributeProps } from "../../pages/accounts/interfaces/Accounts.i";
import { AddItemAction } from "../../interfaces/basket.redux.i";
import { ProductProps } from "./Product.i";

export interface ViewProps {
  id: string;
  userAttributes: UserAttributeProps;
  addToBasket?: (product) => AddItemAction;
  store?: Store; // test - mock-redux-store
}

export interface ViewState {
  product: ProductProps;
}

export interface ViewDispatchProps {
  addToBasket: (product) => AddItemAction;
}
