import { FilterProps } from "../pages/accounts/interfaces/ProductList.i";
import { ProductProps } from "../pages/accounts/interfaces/Product.i";
import ProductActionTypes, {
  SET_FILTERS,
  CLEAR_FILTERS,
  FETCH_CURRENT_FAILURE,
  FETCH_CURRENT_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_SUCCESS,
} from "../interfaces/products.redux.i";

const defaultProductState = {
  items: [],
  filters: null,
  current: null,
};

export interface ProductState {
  items: ProductProps[];
  filters: FilterProps | null;
  current: ProductProps | null;
}

export default (
  state = defaultProductState,
  action: ProductActionTypes,
): ProductState => {
  switch (action.type) {
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        items: action.products,
      };
    case FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        items: [],
      };
    case CLEAR_FILTERS:
      return {
        ...state,
        filters: null,
      };
    case SET_FILTERS:
      return {
        ...state,
        filters: action.filters,
      };
    case FETCH_CURRENT_SUCCESS:
      return {
        ...state,
        current: action.product,
      };
    case FETCH_CURRENT_FAILURE:
      return {
        ...state,
        current: null,
      };
    default:
      return state;
  }
};
