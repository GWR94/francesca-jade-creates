import { Dispatch } from "redux";
import { API } from "aws-amplify";
import { listProducts } from "../graphql/queries";
import { ProductProps } from "../pages/accounts/interfaces/Product.i";
import {
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  SET_FILTERS,
  FetchProductsFailureAction,
  FetchProductsSuccessAction,
  SetFiltersAction,
  FilterActionProps,
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

export const setSearchFilters = (filters: FilterActionProps): SetFiltersAction => ({
  type: SET_FILTERS,
  filters,
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
