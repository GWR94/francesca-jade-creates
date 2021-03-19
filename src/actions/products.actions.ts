import { Dispatch } from "redux";
import { API } from "aws-amplify";
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
  FetchProductsFailureAction,
  FetchProductsSuccessAction,
  GetProductsAction,
  ResetFiltersAction,
  SetFiltersAction,
  SetSearchQueryAction,
} from "../interfaces/products.redux.i";
import { AppState } from "../store/store";
import { SearchType } from "../pages/products/interfaces/ProductList.i";

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
      products: { filters },
    } = getState();
    try {
      dispatch(handleGetProducts());
      const { data } = await API.graphql({
        query: listProducts,
        variables: {
          filter: {
            ...filters,
          },
          limit: 100,
        },
        // @ts-ignore
        authMode: "API_KEY",
      });
      console.log(data.listProducts.items);
      return dispatch(fetchProductsSuccess(data.listProducts.items));
    } catch (error) {
      console.error(error);
      return dispatch(fetchProductsFailure());
    }
  };
};
