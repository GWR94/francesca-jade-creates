import { AdminFilters } from "../pages/products/interfaces/SearchFilter.i";
import { SearchType } from "../pages/products/interfaces/ProductList.i";
import { ProductProps } from "../pages/accounts/interfaces/Product.i";

export const GET_PRODUCTS = "GET_PRODUCTS";
export const SET_FILTERS = "SET_FILTERS";
export const CLEAR_FILTERS = "CLEAR_FILTERS";
export const FETCH_PRODUCTS_FAILURE = "FETCH_PRODUCTS_FAILURE";
export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";
export const SEARCH_PRODUCTS_SUCCESS = "SEARCH_PRODUCTS_SUCCESS";
export const SEARCH_PRODUCTS_FAILURE = "SEARCH_PRODUCTS_FAILURE";
export const HANDLE_SORT_PRODUCTS = "HANDLE_SORT_PRODUCTS";
export const FILTER_PRODUCTS = "FILTER_PRODUCTS";

export interface FilterActionProps {
  searchType: SearchType;
  adminFilters: AdminFilters | null;
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
  filters: FilterActionProps;
}

export interface ClearFiltersAction {
  type: typeof CLEAR_FILTERS;
}

export interface SearchProductsSuccessAction {
  type: typeof SEARCH_PRODUCTS_SUCCESS;
  products: ProductProps[];
}

export interface SearchProductsFailureAction {
  type: typeof SEARCH_PRODUCTS_FAILURE;
}

export interface FetchProductsSuccessAction {
  type: typeof FETCH_PRODUCTS_SUCCESS;
  products: ProductProps[];
}

export interface FetchProductsFailureAction {
  type: typeof FETCH_PRODUCTS_FAILURE;
}

declare type ProductActionTypes =
  | GetProductsAction
  | SetFiltersAction
  | ClearFiltersAction
  | SearchProductsFailureAction
  | SearchProductsSuccessAction
  | FetchProductsFailureAction
  | FetchProductsSuccessAction;

// eslint-disable-next-line no-undef
export { ProductActionTypes as default };
