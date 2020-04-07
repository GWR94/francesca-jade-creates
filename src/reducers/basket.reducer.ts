/* eslint-disable prefer-destructuring */
import { BasketItemProps } from "../pages/payment/interfaces/Basket.i";
import BasketActionTypes, {
  ADD_ITEM_TO_BASKET,
  CLEAR_BASKET,
  REMOVE_ITEM_FROM_BASKET,
} from "../interfaces/basket.redux.i";

const defaultBasketState = {
  items: [],
  cost: 0,
};

export interface BasketState {
  items: BasketItemProps[];
  cost: number;
}

export default (state = defaultBasketState, action: BasketActionTypes): BasketState => {
  switch (action.type) {
    case ADD_ITEM_TO_BASKET: {
      const updatedItems = [...state.items, action.item];
      return {
        ...state,
        items: updatedItems,
        cost: (state.cost += action.item.price + action.item.shippingCost),
      };
    }
    case REMOVE_ITEM_FROM_BASKET: {
      const idx: number = state.items.findIndex((item) => item.id === action.itemID);
      const updatedItems: BasketItemProps[] = [
        ...state.items.slice(0, idx),
        ...state.items.slice(idx + 1),
      ];
      let cost = 0;
      updatedItems.forEach((item) => (cost += item.price + item.shippingCost));
      return {
        ...state,
        items: updatedItems,
        cost,
      };
    }
    case CLEAR_BASKET:
      return {
        ...state,
        items: [],
        cost: 0,
      };
    default:
      return state;
  }
};
