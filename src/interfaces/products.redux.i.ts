import { ProductProps } from "../pages/accounts/interfaces/Product.i";
import { FilterProps } from "../pages/accounts/interfaces/ProductList.i";

export const GET_PRODUCTS = "GET_PRODUCTS";
export const SEARCH_PRODUCTS = "SEARCH_PRODUCTS";
export const SET_FILTERS = "SET_FILTERS";
export const CLEAR_FILTERS = "CLEAR_FILTERS";
export const FETCH_PRODUCTS_FAILURE = "FETCH_PRODUCTS_FAILURE";
export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";
export const FETCH_CURRENT_SUCCESS = "FETCH_CURRENT_SUCCESS";
export const FETCH_CURRENT_FAILURE = "FETCH_CURRENT_FAILURE";

export interface GetProductsAction {
  type: typeof GET_PRODUCTS;
}

export interface SetFiltersAction {
  type: typeof SET_FILTERS;
  filters: FilterProps;
}

export interface ClearFiltersAction {
  type: typeof CLEAR_FILTERS;
}

export interface FetchProductsSuccessAction {
  type: typeof FETCH_PRODUCTS_SUCCESS;
  products: ProductProps[];
}

export interface FetchCurrentSuccessAction {
  type: typeof FETCH_CURRENT_SUCCESS;
  product: ProductProps;
}

export interface FetchCurrentFailureAction {
  type: typeof FETCH_CURRENT_FAILURE;
}

export interface FetchProductsFailureAction {
  type: typeof FETCH_PRODUCTS_FAILURE;
}

declare type ProductActionTypes =
  | GetProductsAction
  | SetFiltersAction
  | ClearFiltersAction
  | FetchCurrentSuccessAction
  | FetchCurrentFailureAction
  | FetchProductsFailureAction
  | FetchProductsSuccessAction;

// eslint-disable-next-line no-undef
export { ProductActionTypes as default };
