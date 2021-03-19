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
  SET_VARIANT,
} from "../interfaces/basket.redux.i";

// create the initial state for the basket store
const defaultBasketState: BasketState = {
  items: [],
  checkout: {
    products: [],
    cost: 0,
  },
};

export interface BasketState {
  // the products currently in the basket (not checkout).
  items: BasketItemProps[];
  checkout: {
    // the confirmed products in checkout (custom options completed)
    products: CheckoutProductProps[];
    // the accumulative cost of all products in checkout
    cost: number;
  };
}

/**
 * Function to return the accumulative cost of an array of checkout products.
 * @param products - Array of completed checkout products, with the correct price and
 * shipping cost present due to having their variant picked by the user.
 */
const getAccumulativeCostFromProducts = (products: CheckoutProductProps[]): number => {
  // reduce the products array, which will return the accumulative cost.
  const cost = products.reduce((acc, product) => {
    return acc + product.variant!.price.item + product.variant!.price.postage;
  }, 0);
  // round the result and return it.
  return Math.round(cost * 100) / 100;
};

export default (state = defaultBasketState, action: BasketActionTypes): BasketState => {
  switch (action.type) {
    // action to add a product into the basket store.
    case ADD_ITEM_TO_BASKET: {
      // create updatedItems variable with new items placed at end
      const updatedItems = [...state.items, action.item];
      return {
        ...state,
        // update the store with updatedItems
        items: updatedItems,
      };
    }
    // action to remove item from basket store.
    case REMOVE_ITEM_FROM_BASKET: {
      // find the index in the items array (if it exists)
      const idx: number = state.items.findIndex(
        (item: BasketItemProps) => item.id === action.itemID,
      );
      // if there is no match, make no changes to state.
      if (idx === -1) return state;
      /**
       * store updatedItems in a variable and remove the item by slicing it
       * out of the array
       */
      const updatedItems: BasketItemProps[] = [
        ...state.items.slice(0, idx),
        ...state.items.slice(idx + 1),
      ];
      // set updatedItems in store.
      return {
        ...state,
        items: updatedItems,
      };
    }
    // action to clear the basket of all products
    case CLEAR_BASKET:
      return {
        ...state,
        // clear basket of all items
        items: [],
      };
    // action to add completed product into checkout store.
    case ADD_ITEM_TO_CHECKOUT: {
      // create a variable for the updatedProducts, and put the product from action in it.
      const updatedProducts = [...state.checkout.products, action.product];
      // get the accumulative cost via its function
      const cost = getAccumulativeCostFromProducts(updatedProducts);
      return {
        ...state,
        checkout: {
          // set updatedProducts into store
          products: updatedProducts,
          // store accumulative cost into store
          cost,
        },
      };
    }
    // action to add custom options to an item already in the checkout store
    case ADD_CUSTOM_OPTIONS_TO_PRODUCT: {
      // destructure data from action object
      const { id, customOptions } = action;
      // store products into a variable so it can be mutated
      const updatedProducts = state.checkout.products;
      // find the index of the product already in the store (if it exists)
      const idx = state.checkout?.products.findIndex(
        (product: CheckoutProductProps) => product.id === id,
      );
      // if the index is not in the array, return the original state.
      if (idx === -1) return state;
      // if it does exists, set the customOptions to be customOptions from action.
      updatedProducts[idx].customOptions = customOptions;
      return {
        ...state,
        checkout: {
          ...state.checkout,
          // update the store with updatedProducts as products
          products: updatedProducts,
        },
      };
    }
    // action to remove item from checkout
    case REMOVE_ITEM_FROM_CHECKOUT: {
      // find the index of item sent via the action (if it exists)
      const idx: number = state.checkout.products.findIndex(
        (product: CheckoutProductProps) => product.id === action.itemID,
      );
      // if there is no product found, return the unchanged state.
      if (idx === -1) return state;
      /**
       * if it is found, slice the item out by spreading all indices before
       * and after idx.
       */
      const updatedProducts: CheckoutProductProps[] = [
        ...state.checkout.products.slice(0, idx),
        ...state.checkout.products.slice(idx + 1),
      ];
      // get the accumulative cost via function
      const cost = getAccumulativeCostFromProducts(updatedProducts);
      return {
        ...state,
        checkout: {
          // set updatedProducts into store
          products: updatedProducts,
          // updated cost in store
          cost,
        },
      };
    }
    // action to clear all products from checkout store
    case CLEAR_CHECKOUT:
      return {
        ...state,
        checkout: {
          // update products with empty array
          products: [],
          // set cost to 0 as there's obviously no accumulative cost
          cost: 0,
        },
      };
    // function to set variant for product in checkout
    case SET_VARIANT: {
      // destructure data from action object
      const { id, variant } = action;
      // find products index (if it exists)
      const idx = state.checkout.products.findIndex(
        (product: CheckoutProductProps) => product.id === id,
      );
      // if the index is not found, return unmodified state.
      if (idx === -1) return state;
      // store updatedProducts into a variable so it can be mutated.
      const updatedProducts = state.checkout.products;
      // set the product at idx to be variant passed from action.
      updatedProducts[idx].variant = variant;
      const cost = getAccumulativeCostFromProducts(updatedProducts);
      return {
        ...state,
        checkout: {
          // store the updatedProducts in store
          products: updatedProducts,
          // update the cost in the store
          cost,
        },
      };
    }
    default:
      return state;
  }
};
