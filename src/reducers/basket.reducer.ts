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
  UPDATE_CUSTOM_OPTIONS,
} from "../interfaces/basket.redux.i";
import { Variant } from "../pages/accounts/interfaces/Variants.i";

const defaultBasketState = {
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
    case CLEAR_CHECKOUT: {
      return {
        ...state,
        checkout: {
          products: [],
          cost: 0,
        },
      };
    }
    case UPDATE_CUSTOM_OPTIONS: {
      const idx = state.checkout.products.findIndex(
        (product: CheckoutProductProps) => product.id === action.id,
      );
      const updatedProducts: CheckoutProductProps[] = state.checkout.products;
      updatedProducts[idx].customOptions = action.customOptions;
      return {
        ...state,
        checkout: {
          products: updatedProducts,
          cost: getCostToFixed(updatedProducts),
        },
      };
    }
    default:
      return state;
  }
};
