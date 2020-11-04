import { SET_VARIANT } from "./../interfaces/basket.redux.i";
import {
  BasketItemProps,
  CheckoutProductProps,
} from "../pages/payment/interfaces/Basket.i";
import BasketActionTypes, {
  ADD_ITEM_TO_BASKET,
  ADD_ITEM_TO_CHECKOUT,
  CLEAR_BASKET,
  REMOVE_ITEM_FROM_BASKET,
  REMOVE_ITEM_FROM_CHECKOUT,
  CLEAR_CHECKOUT,
  ADD_CUSTOM_OPTIONS_TO_PRODUCT,
} from "../interfaces/basket.redux.i";

const defaultBasketState: BasketState = {
  items: [],
  checkout: {
    products: [],
    cost: 0,
  },
};

export interface BasketState {
  items: BasketItemProps[];
  checkout: {
    products: CheckoutProductProps[];
    cost: number;
  };
}

const getCostToFixed = (products: CheckoutProductProps[]): number => {
  const cost = products.reduce((acc, product) => {
    return acc + product.price + product.shippingCost;
  }, 0);
  return Math.round(cost * 100) / 100;
};

export default (state = defaultBasketState, action: BasketActionTypes): BasketState => {
  switch (action.type) {
    case ADD_ITEM_TO_BASKET: {
      const updatedItems = [...state.items, action.item];
      return {
        ...state,
        items: updatedItems,
      };
    }
    case REMOVE_ITEM_FROM_BASKET: {
      const idx: number = state.items.findIndex(
        (item: BasketItemProps) => item.id === action.itemID,
      );
      const updatedItems: BasketItemProps[] = [
        ...state.items.slice(0, idx),
        ...state.items.slice(idx + 1),
      ];
      return {
        ...state,
        items: updatedItems,
      };
    }
    case CLEAR_BASKET:
      return {
        ...state,
        items: [],
      };
    case ADD_ITEM_TO_CHECKOUT: {
      const updatedProducts = [...state.checkout.products, action.product];
      const cost = getCostToFixed(updatedProducts);
      return {
        ...state,
        checkout: {
          products: updatedProducts,
          cost,
        },
      };
    }
    case ADD_CUSTOM_OPTIONS_TO_PRODUCT: {
      const { id, customOptions } = action;
      const updatedProducts = state.checkout.products;
      const idx = state.checkout?.products.findIndex(
        (product: CheckoutProductProps) => product.id === id,
      );
      updatedProducts[idx].customOptions = customOptions;
      return {
        ...state,
        checkout: {
          ...state.checkout,
          products: updatedProducts,
        },
      };
    }
    case REMOVE_ITEM_FROM_CHECKOUT: {
      const idx: number = state.checkout.products.findIndex(
        (product: CheckoutProductProps) => product.id === action.itemID,
      );
      const updatedProducts: CheckoutProductProps[] = [
        ...state.checkout.products.slice(0, idx),
        ...state.checkout.products.slice(idx + 1),
      ];
      const cost = getCostToFixed(updatedProducts);
      return {
        ...state,
        checkout: {
          products: updatedProducts,
          cost,
        },
      };
    }
    case CLEAR_CHECKOUT:
      return {
        ...state,
        checkout: {
          products: [],
          cost: 0,
        },
      };
    case SET_VARIANT: {
      const { id, variant } = action;
      const idx = state.checkout.products.findIndex(
        (product: CheckoutProductProps) => product.id === id,
      );
      const updatedProducts = state.checkout.products;
      updatedProducts[idx].variant = variant;
      return {
        ...state,
        checkout: {
          ...state.checkout,
          products: updatedProducts,
        },
      };
    }
    default:
      return state;
  }
};
