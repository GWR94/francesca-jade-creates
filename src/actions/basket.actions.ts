import {
  ADD_ITEM_TO_BASKET,
  CLEAR_BASKET,
  REMOVE_ITEM_FROM_BASKET,
  AddItemAction,
  ClearBasketAction,
  RemoveItemAction,
} from "../interfaces/basket.redux.i";
import { BasketItemProps } from "../pages/payment/interfaces/Basket.i";

export const addToBasket = (item: BasketItemProps): AddItemAction => ({
  type: ADD_ITEM_TO_BASKET,
  item,
});

export const clearBasket = (): ClearBasketAction => ({
  type: CLEAR_BASKET,
});

export const removeFromBasket = (itemID: string): RemoveItemAction => ({
  type: REMOVE_ITEM_FROM_BASKET,
  itemID,
});
