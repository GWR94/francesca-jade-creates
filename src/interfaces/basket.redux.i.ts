import { BasketItemProps } from "../pages/payment/interfaces/Basket.i";

// - Basket Actions - //
export const ADD_ITEM_TO_BASKET = "ADD_ITEM_TO_BASKET";
export const CLEAR_BASKET = "CLEAR_BASKET";
export const REMOVE_ITEM_FROM_BASKET = "REMOVE_ITEM_FROM_BASKET";

export interface AddItemAction {
  type: typeof ADD_ITEM_TO_BASKET;
  item: BasketItemProps;
}

export interface ClearBasketAction {
  type: typeof CLEAR_BASKET;
}

export interface RemoveItemAction {
  type: typeof REMOVE_ITEM_FROM_BASKET;
  itemID: string;
}

declare type BasketActionTypes = AddItemAction | ClearBasketAction | RemoveItemAction;

// eslint-disable-next-line no-undef
export { BasketActionTypes as default };
