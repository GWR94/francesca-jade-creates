import { Store } from "redux";
import { BasketItemProps } from "../../payment/interfaces/Basket.i";
import { AddItemAction } from "../../../interfaces/basket.redux.i";
import { ProductProps } from "../../accounts/interfaces/Product.i";

export interface ViewProps {
  id?: string; // id of product the user is attempting to view
  addToBasket?: (product: BasketItemProps) => AddItemAction; // action to dispatch to store
  store?: Store; // test - mock-redux-store
  type: "Cake" | "Creates"; // product type
}

export interface ViewState {
  product: ProductProps; // data for the current product
}

export interface ViewDispatchProps {
  addToBasket: (product: BasketItemProps) => AddItemAction; // action to dispatch to store
}
