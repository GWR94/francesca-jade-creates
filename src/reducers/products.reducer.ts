import { ProductProps } from "../pages/accounts/interfaces/Product.i";
import ProductActionTypes, {
  SET_FILTERS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_SUCCESS,
  GET_PRODUCTS,
  GET_PRODUCTS_BY_TYPE,
  RESET_FILTERS,
  FilterActionProps,
} from "../interfaces/products.redux.i";
import { FlightTakeoffSharp } from "@material-ui/icons";

const defaultProductState: ProductState = {
  items: [],
  filters: {
    searchType: "all",
    type: {
      cake: true,
      creates: false,
    },
    sortDirection: "DESC",
    sortBy: "createdAt",
    shouldUpdateWithNoQuery: false,
  },
  isSearching: false,
  query: "",
  noResults: false,
};

export interface ProductState {
  items: ProductProps[];
  filters: FilterActionProps;
  isSearching: boolean;
  query: string;
  noResults: boolean;
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
    case GET_PRODUCTS:
      return {
        ...state,
        isSearching: true,
        noResults: false,
      };
    case GET_PRODUCTS_BY_TYPE:
      return {
        ...state,
        isSearching: true,
        filters: {
          ...state.filters,
          type: {
            cake: action.productType.cake,
            creates: action.productType.creates,
          },
        },
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
        filters: {
          searchType: "all",
          type: {
            cake: true,
            creates: false,
          },
          sortDirection: "DESC",
          sortBy: "createdAt",
          shouldUpdateWithNoQuery: false,
        },
      };
    default:
      return state;
  }
};
