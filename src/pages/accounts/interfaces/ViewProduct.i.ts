import { Store } from "redux";
import { BasketItemProps } from "../../payment/interfaces/Basket.i";
import { AddItemAction } from "../../../interfaces/basket.redux.i";
import { ProductProps } from "./Product.i";

export interface ViewProps {
  id: string;
  addToBasket?: (product: BasketItemProps) => AddItemAction;
  store?: Store; // test - mock-redux-store
  type: "Cake" | "Creates";
}

export interface ViewState {
  product: ProductProps;
}

export interface ViewDispatchProps {
  addToBasket: (product: BasketItemProps) => AddItemAction;
}
