import { FilterProps } from "../pages/accounts/interfaces/ProductList.i";
import { ProductProps } from "../pages/accounts/interfaces/Product.i";
import ProductActionTypes, {
  SET_FILTERS,
  FILTER_PRODUCTS,
  SEARCH_PRODUCTS_FAILURE,
  SEARCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_SUCCESS,
  HANDLE_SORT_PRODUCTS,
} from "../interfaces/products.redux.i";

const defaultProductState = {
  items: [],
  filters: null,
  search: null,
};

export interface ProductState {
  items: ProductProps[];
  filters: FilterProps | null;
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
    case HANDLE_SORT_PRODUCTS: {
      let search = null;
      if (state.search !== null) {
        // @ts-ignore
        search = state.search.sort((a: ProductProps, b: ProductProps) =>
          // @ts-ignore
          a[action.sortMethod] > b[action.sortMethod] ? -1 : 1,
        );
      }
      return {
        ...state,
        search,
        // @ts-ignore
        items: state.items.sort((a, b) => (a[action.sortBy] > b[action.sortBy] ? -1 : 1)),
      };
    }
    case FILTER_PRODUCTS: {
      let search;
      if (state.search !== null) {
        // @ts-ignore
        search = state.search.filter(
          (item: ProductProps) => item.type === action.filterType,
        );
        return {
          ...state,
          search,
        };
      }
      break;
    }
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
