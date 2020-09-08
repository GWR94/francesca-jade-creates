import {
  BasketItemProps,
  CheckoutProductProps,
} from "../pages/payment/interfaces/Basket.i";
import {
  ADD_ITEM_TO_BASKET,
  ADD_ITEM_TO_CHECKOUT,
  CLEAR_BASKET,
  CLEAR_CHECKOUT,
  REMOVE_ITEM_FROM_BASKET,
  REMOVE_ITEM_FROM_CHECKOUT,
  AddItemAction,
  AddToCheckoutAction,
  ClearBasketAction,
  ClearCheckoutAction,
  RemoveFromCheckoutAction,
  RemoveItemAction,
  UPDATE_CUSTOM_OPTIONS,
  UpdateCustomOptionsAction,
  CustomOptionArrayType,
} from "../interfaces/basket.redux.i";

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

export const addToCheckout = (product: CheckoutProductProps): AddToCheckoutAction => ({
  type: ADD_ITEM_TO_CHECKOUT,
  product,
});

export const removeFromCheckout = (itemID: string): RemoveFromCheckoutAction => ({
  type: REMOVE_ITEM_FROM_CHECKOUT,
  itemID,
});

export const clearCheckout = (): ClearCheckoutAction => ({
  type: CLEAR_CHECKOUT,
});

export const updateCustomOptions = (
  id: string,
  customOptions: CustomOptionArrayType,
): UpdateCustomOptionsAction => ({
  type: UPDATE_CUSTOM_OPTIONS,
  id,
  customOptions,
});
