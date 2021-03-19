import { ModelProductFilterInput } from "../API";
import { ProductFilterType } from "../pages/products/interfaces/SearchFilter.i";
import { SearchType } from "../pages/products/interfaces/ProductList.i";
import { ProductProps } from "../pages/accounts/interfaces/Product.i";

export const GET_PRODUCTS = "GET_PRODUCTS";
export const SET_FILTERS = "SET_FILTERS";
export const RESET_FILTERS = "RESET_FILTERS";
export const FETCH_PRODUCTS_FAILURE = "FETCH_PRODUCTS_FAILURE";
export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";
export const SET_SEARCH_QUERY = "SET_SEARCH_QUERY";
export interface FilterActionProps {
  searchType: SearchType;
  type: ProductFilterType;
  sortDirection: "ASC" | "DESC";
  sortBy: SortBy;
  shouldUpdateWithNoQuery: boolean;
}

export type SortBy = "createdAt" | "price";

export interface GetProductsAction {
  type: typeof GET_PRODUCTS;
}

export interface SetFiltersAction {
  type: typeof SET_FILTERS;
  filters: ModelProductFilterInput;
}

export interface ResetFiltersAction {
  type: typeof RESET_FILTERS;
}

export interface FetchProductsSuccessAction {
  type: typeof FETCH_PRODUCTS_SUCCESS;
  products: ProductProps[];
}

export interface FetchProductsFailureAction {
  type: typeof FETCH_PRODUCTS_FAILURE;
}

export interface SetSearchQueryAction {
  type: typeof SET_SEARCH_QUERY;
  query: string;
}

declare type ProductActionTypes =
  | GetProductsAction
  | SetFiltersAction
  | ResetFiltersAction
  | FetchProductsFailureAction
  | FetchProductsSuccessAction
  | SetSearchQueryAction;

// eslint-disable-next-line no-undef
export { ProductActionTypes as default };
