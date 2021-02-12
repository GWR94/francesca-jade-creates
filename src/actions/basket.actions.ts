import {
  BasketItemProps,
  CheckoutProductProps,
  CustomOptionArrayType,
} from "../pages/payment/interfaces/Basket.i";
import {
  ADD_ITEM_TO_BASKET,
  ADD_ITEM_TO_CHECKOUT,
  CLEAR_BASKET,
  CLEAR_CHECKOUT,
  REMOVE_ITEM_FROM_BASKET,
  REMOVE_ITEM_FROM_CHECKOUT,
  ADD_CUSTOM_OPTIONS_TO_PRODUCT,
  SET_VARIANT,
  AddItemAction,
  AddToCheckoutAction,
  ClearBasketAction,
  ClearCheckoutAction,
  RemoveFromCheckoutAction,
  RemoveItemAction,
  AddCustomOptionsToProductAction,
  SetVariantAction,
} from "../interfaces/basket.redux.i";
import { Variant } from "../pages/products/interfaces/Variants.i";

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

export const setVariant = (id: string, variant: Variant): SetVariantAction => ({
  type: SET_VARIANT,
  id,
  variant,
});

export const addCustomOptionsToProduct = (
  id: string,
  customOptions: CustomOptionArrayType,
): AddCustomOptionsToProductAction => ({
  type: ADD_CUSTOM_OPTIONS_TO_PRODUCT,
  id,
  customOptions,
});
