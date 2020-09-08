import { CustomOptionArrayType } from "./../pages/payment/components/BasketCustomOptions";
import { ClearCheckoutAction } from "./basket.redux.i";
import {
  CheckoutProductProps,
  BasketItemProps,
} from "../pages/payment/interfaces/Basket.i";

// - Basket Actions - //
export const ADD_ITEM_TO_BASKET = "ADD_ITEM_TO_BASKET";
export const CLEAR_BASKET = "CLEAR_BASKET";
export const REMOVE_ITEM_FROM_BASKET = "REMOVE_ITEM_FROM_BASKET";
export const ADD_ITEM_TO_CHECKOUT = "ADD_ITEM_TO_CHECKOUT";
export const REMOVE_ITEM_FROM_CHECKOUT = "REMOVE_ITEM_FROM_CHECKOUT";
export const CLEAR_CHECKOUT = "CLEAR_CHECKOUT";
export const UPDATE_CUSTOM_OPTIONS = "UPDATE_CUSTOM_OPTIONS";

export interface AddItemAction {
  type: typeof ADD_ITEM_TO_BASKET;
  item: BasketItemProps;
}

export interface ClearBasketAction {
  type: typeof CLEAR_BASKET;
}

export interface ClearCheckoutAction {
  type: typeof CLEAR_CHECKOUT;
}

export interface RemoveItemAction {
  type: typeof REMOVE_ITEM_FROM_BASKET;
  itemID: string;
}

export interface AddToCheckoutAction {
  type: typeof ADD_ITEM_TO_CHECKOUT;
  product: CheckoutProductProps;
}

export interface RemoveFromCheckoutAction {
  type: typeof REMOVE_ITEM_FROM_CHECKOUT;
  itemID: string;
}

export interface UpdateCustomOptionsAction {
  type: typeof UPDATE_CUSTOM_OPTIONS;
  id: string;
  customOptions: CustomOptionArrayType;
}

declare type BasketActionTypes =
  | AddItemAction
  | ClearBasketAction
  | RemoveItemAction
  | AddToCheckoutAction
  | RemoveFromCheckoutAction
  | ClearCheckoutAction
  | UpdateCustomOptionsAction;

// eslint-disable-next-line no-undef
export { BasketActionTypes as default };
