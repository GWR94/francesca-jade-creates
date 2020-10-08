import { ProductProps } from "../pages/accounts/interfaces/Product.i";
import ProductActionTypes, {
  SET_FILTERS,
  SEARCH_PRODUCTS_FAILURE,
  SEARCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_SUCCESS,
  FilterActionProps,
} from "../interfaces/products.redux.i";

const defaultProductState: ProductState = {
  items: [],
  filters: {
    searchType: "all",
    adminFilters: null,
    sortDirection: "DESC",
    sortBy: "createdAt",
    shouldUpdateWithNoQuery: false,
  },
  search: null,
};

export interface ProductState {
  items: ProductProps[];
  filters: FilterActionProps;
  search: ProductProps[] | null;
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
    case SET_FILTERS:
      return {
        ...state,
        filters: action.filters,
      };
    case SEARCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        search: action.products,
      };
    case SEARCH_PRODUCTS_FAILURE:
      return {
        ...state,
        search: null,
      };
    default:
      return state;
  }
};
