import { Dispatch, Store } from "redux";
import { API } from "aws-amplify";
import { listProducts } from "../graphql/queries";
import { ProductProps } from "../pages/accounts/interfaces/Product.i";
import {
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  SET_FILTERS,
  GET_PRODUCTS,
  FetchProductsFailureAction,
  FetchProductsSuccessAction,
  GetProductsAction,
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

export const handleGetProducts = (): GetProductsAction => ({
  type: GET_PRODUCTS,
});

export const getProducts = (searchQuery?: string) => {
  return async (
    dispatch: Dispatch,
  ): Promise<
    FetchProductsSuccessAction | FetchProductsFailureAction | GetProductsAction
  > => {
    try {
      dispatch(handleGetProducts());
      const { data } = await API.graphql({
        query: listProducts,
        variables: {
          filter: searchQuery
            ? {
                or: [
                  { tags: { contains: searchQuery } },
                  { title: { contains: searchQuery } },
                  { description: { contains: searchQuery } },
                ],
              }
            : null,
          limit: 100,
        },
        // @ts-ignore
        authMode: "API_KEY",
      });
      return dispatch(fetchProductsSuccess(data.listProducts.items));
    } catch (error) {
      console.error(error);
      return dispatch(fetchProductsFailure());
    }
  };
};

export const getProductsByType = (type: "Cake" | "Creates", searchQuery?: string) => {
  return async (
    dispatch: Dispatch,
  ): Promise<FetchProductsSuccessAction | FetchProductsFailureAction> => {
    try {
      const { data } = await API.graphql({
        query: listProducts,
        variables: {
          filters: {
            or: searchQuery
              ? [
                  { tags: { contains: searchQuery } },
                  { title: { contains: searchQuery } },
                  { description: { contains: searchQuery } },
                ]
              : null,
            and: [
              {
                type: {
                  eq: type,
                },
              },
            ],
          },
        },
      });
      return dispatch(fetchProductsSuccess(data.listProducts.items));
    } catch (error) {
      console.error(error);
      return dispatch(fetchProductsFailure());
    }
  };
};

export const getProductsByTheme = (theme: string) => {
  return async (
    dispatch: Dispatch,
  ): Promise<FetchProductsSuccessAction | FetchProductsFailureAction> => {
    try {
      const { data } = await API.graphql({
        query: listProducts,
        variables: {
          filter: {
            tags: {
              contains: theme,
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
