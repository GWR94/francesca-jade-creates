import { Dispatch } from "redux";
import { API, graphqlOperation } from "aws-amplify";
import { getProduct, listProducts } from "../graphql/queries";
import { ProductProps } from "../pages/accounts/interfaces/Product.i";
import { FilterProps } from "../pages/accounts/interfaces/ProductList.i";
import {
  SET_FILTERS,
  CLEAR_FILTERS,
  SetFiltersAction,
  ClearFiltersAction,
  FETCH_CURRENT_FAILURE,
  FETCH_CURRENT_SUCCESS,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FetchCurrentFailureAction,
  FetchCurrentSuccessAction,
  FetchProductsFailureAction,
  FetchProductsSuccessAction,
} from "../interfaces/products.redux.i";

export const fetchProductsSuccess = (
  products: ProductProps[],
): FetchProductsSuccessAction => ({
  type: FETCH_PRODUCTS_SUCCESS,
  products,
});

export const fetchProductsFailure = (): FetchProductsFailureAction => ({
  type: FETCH_PRODUCTS_FAILURE,
});

export const getProducts = () => {
  return async (
    dispatch: Dispatch,
  ): Promise<FetchProductsSuccessAction | FetchProductsFailureAction> => {
    try {
      const { data } = await API.graphql(graphqlOperation(listProducts));
      return dispatch(fetchProductsSuccess(data.listProducts.items));
    } catch (error) {
      return dispatch(fetchProductsFailure());
    }
  };
};

export const fetchCurrentSuccess = (
  product: ProductProps,
): FetchCurrentSuccessAction => ({
  type: FETCH_CURRENT_SUCCESS,
  product,
});

export const fetchCurrentFailure = (): FetchCurrentFailureAction => ({
  type: FETCH_CURRENT_FAILURE,
});

export const getCurrentProduct = (id: string) => {
  return async (
    dispatch: Dispatch,
  ): Promise<FetchCurrentSuccessAction | FetchCurrentFailureAction> => {
    try {
      const { data } = await API.graphql(graphqlOperation(getProduct, { id }));
      return fetchCurrentSuccess(data.getProduct);
    } catch (err) {
      return dispatch(fetchCurrentFailure());
    }
  };
};

export const setFilters = (filters: FilterProps): SetFiltersAction => ({
  type: SET_FILTERS,
  filters,
});

export const clearFilters = (): ClearFiltersAction => ({
  type: CLEAR_FILTERS,
});
