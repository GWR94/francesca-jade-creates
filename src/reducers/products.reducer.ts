import { ModelProductFilterInput } from "../API";
import { ProductProps } from "../pages/accounts/interfaces/Product.i";
import ProductActionTypes, {
  SET_FILTERS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_SUCCESS,
  GET_PRODUCTS,
  RESET_FILTERS,
  SET_SEARCH_QUERY,
  SET_SORT_BY,
  SortBy,
  SortDirection,
} from "../interfaces/products.redux.i";

const defaultProductState: ProductState = {
  items: [],
  filters: null,
  isSearching: false,
  query: "",
  noResults: false,
  sortBy: "updatedAt",
  sortDirection: "DESC",
};

export interface ProductState {
  items: ProductProps[];
  filters: ModelProductFilterInput | null;
  isSearching: boolean;
  query: string;
  noResults: boolean;
  sortBy: SortBy;
  sortDirection: SortDirection;
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
        isSearching: false,
        noResults: false,
      };
    case FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        items: [],
        isSearching: false,
        noResults: true,
      };
    case SET_SEARCH_QUERY:
      return {
        ...state,
        query: action.query,
      };
    case SET_SORT_BY:
      return {
        ...state,
        sortBy: action.sortBy,
        sortDirection: action.sortDirection,
      };
    case GET_PRODUCTS:
      return {
        ...state,
        isSearching: true,
        noResults: false,
      };
    case SET_FILTERS:
      return {
        ...state,
        filters: action.filters,
      };
    case RESET_FILTERS:
      return {
        ...state,
        filters: null,
      };
    default:
      return state;
  }
};
