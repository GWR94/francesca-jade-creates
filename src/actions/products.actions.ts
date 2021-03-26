import { Dispatch } from "redux";
import { API } from "aws-amplify";
import _ from "underscore";
import { getMinPriceFromVariants } from "../utils/index";
import { ModelProductFilterInput } from "../API";
import { listProducts } from "../graphql/queries";
import { ProductProps } from "../pages/accounts/interfaces/Product.i";
import {
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_SUCCESS,
  GET_PRODUCTS,
  RESET_FILTERS,
  SET_FILTERS,
  SET_SEARCH_QUERY,
  SET_SORT_BY,
  FetchProductsFailureAction,
  FetchProductsSuccessAction,
  GetProductsAction,
  ResetFiltersAction,
  SetFiltersAction,
  SetSearchQueryAction,
  SetSortByAction,
  SortBy,
  SortDirection,
} from "../interfaces/products.redux.i";
import { AppState } from "../store/store";

export const fetchProductsSuccess = (
  products: ProductProps[],
): FetchProductsSuccessAction => ({
  type: FETCH_PRODUCTS_SUCCESS,
  products,
});

export const setSearchQuery = (query: string): SetSearchQueryAction => ({
  type: SET_SEARCH_QUERY,
  query,
});

export const setSortBy = (
  sortDirection: SortDirection,
  sortBy: SortBy,
): SetSortByAction => ({
  type: SET_SORT_BY,
  sortDirection,
  sortBy,
});

export const fetchProductsFailure = (): FetchProductsFailureAction => ({
  type: FETCH_PRODUCTS_FAILURE,
});

export const setSearchFilters = (filters: ModelProductFilterInput): SetFiltersAction => ({
  type: SET_FILTERS,
  filters,
});

export const resetSearchFilters = (): ResetFiltersAction => ({
  type: RESET_FILTERS,
});

export const handleGetProducts = (): GetProductsAction => ({
  type: GET_PRODUCTS,
});

export const getProducts = () => {
  return async (
    dispatch: Dispatch,
    getState: () => AppState,
  ): Promise<FetchProductsSuccessAction | FetchProductsFailureAction> => {
    const {
      products: { filters, sortBy, sortDirection },
    } = getState();
    try {
      dispatch(handleGetProducts());
      const { data } = await API.graphql({
        query: listProducts,
        variables: {
          filter: _.isEmpty(filters) ? null : filters,
          limit: 100,
        },
        // @ts-ignore
        authMode: "API_KEY",
      });
      let sorted;
      if (sortBy === "price") {
        /**
         * retrieve cakes as a separate array, so it can be put last as there are
         * no prices for cakes, and it seems counterproductive to put them anywhere
         * else when sorting via price
         */
        const cakes = data.listProducts.items.filter(
          (product: ProductProps) => product.type === "Cake",
        );
        const creates = data.listProducts.items
          .filter((product: ProductProps) => product.type !== "Cake")
          .sort((a: ProductProps, b: ProductProps) => {
            return getMinPriceFromVariants(a?.variants) >
              getMinPriceFromVariants(b?.variants)
              ? sortDirection === "ASC"
                ? 1
                : -1
              : sortDirection === "ASC"
              ? -1
              : 1;
          });
        sorted = [...creates, ...cakes];
      } else {
        sorted = data.listProducts.items.sort((a: ProductProps, b: ProductProps) =>
          sortDirection === "ASC"
            ? a?.updatedAt > b?.updatedAt
              ? 1
              : -1
            : a?.updatedAt < b?.updatedAt
            ? 1
            : -1,
        );
      }
      return dispatch(fetchProductsSuccess(sorted));
    } catch (error) {
      console.error(error);
      return dispatch(fetchProductsFailure());
    }
  };
};
