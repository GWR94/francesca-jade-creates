import { Dispatch } from "redux";
import { API } from "aws-amplify";
import { listProducts } from "../graphql/queries";
import { ProductProps } from "../pages/accounts/interfaces/Product.i";
import {
  SearchProductsSuccessAction,
  SearchProductsFailureAction,
  SEARCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FetchProductsFailureAction,
  FetchProductsSuccessAction,
  HandleSortProductsAction,
  HANDLE_SORT_PRODUCTS,
  FILTER_PRODUCTS,
  FilterProductsAction,
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

export const searchProductsSuccess = (
  products: ProductProps[],
): SearchProductsSuccessAction => ({
  type: SEARCH_PRODUCTS_SUCCESS,
  products,
});

export const searchProductsFailure = (): SearchProductsFailureAction => ({
  type: SEARCH_PRODUCTS_FAILURE,
});

export const handleSortProducts = (
  sortMethod: "updatedAt" | "createdAt",
): HandleSortProductsAction => ({
  type: HANDLE_SORT_PRODUCTS,
  sortMethod,
});

export const filterProducts = (filterType: "Cake" | "Creates"): FilterProductsAction => ({
  type: FILTER_PRODUCTS,
  filterType,
});

export const getProducts = (type?: "Cake" | "Creates") => {
  return async (
    dispatch: Dispatch,
  ): Promise<FetchProductsSuccessAction | FetchProductsFailureAction> => {
    try {
      const { data } = await API.graphql({
        query: listProducts,
        variables: {
          filter: type && {
            type: {
              eq: type,
            },
          },
          limit: 100,
        },
        // @ts-ignore
        authMode: "API_KEY",
      });
      return dispatch(fetchProductsSuccess(data.listProducts.items));
    } catch (error) {
      return dispatch(fetchProductsFailure());
    }
  };
};
