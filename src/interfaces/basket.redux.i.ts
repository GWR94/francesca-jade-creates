import { Variant } from "../pages/products/interfaces/Variants.i";
import {
  CheckoutProductProps,
  BasketItemProps,
  CustomOptionArrayType,
} from "../pages/payment/interfaces/Basket.i";

// - Basket Actions - //
export const ADD_ITEM_TO_BASKET = "ADD_ITEM_TO_BASKET";
export const CLEAR_BASKET = "CLEAR_BASKET";
export const REMOVE_ITEM_FROM_BASKET = "REMOVE_ITEM_FROM_BASKET";
export const ADD_ITEM_TO_CHECKOUT = "ADD_ITEM_TO_CHECKOUT";
export const REMOVE_ITEM_FROM_CHECKOUT = "REMOVE_ITEM_FROM_CHECKOUT";
export const CLEAR_CHECKOUT = "CLEAR_CHECKOUT";
export const ADD_CUSTOM_OPTIONS_TO_PRODUCT = "ADD_CUSTOM_OPTIONS_TO_PRODUCT";
export const SET_VARIANT = "SET_VARIANT";

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

export interface AddCustomOptionsToProductAction {
  type: typeof ADD_CUSTOM_OPTIONS_TO_PRODUCT;
  id: string;
  customOptions: CustomOptionArrayType;
}

export interface SetVariantAction {
  type: typeof SET_VARIANT;
  id: string;
  variant: Variant;
}

declare type BasketActionTypes =
  | AddItemAction
  | ClearBasketAction
  | RemoveItemAction
  | AddToCheckoutAction
  | RemoveFromCheckoutAction
  | ClearCheckoutAction
  | AddCustomOptionsToProductAction
  | SetVariantAction;

// eslint-disable-next-line no-undef
export { BasketActionTypes as default };
