import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import Amplify, { API } from "aws-amplify";
import * as actions from "../products.actions";
import * as types from "../../interfaces/products.redux.i";
import { ProductProps } from "../../pages/accounts/interfaces/Product.i";
import awsExports from "../../aws-exports";

Amplify.configure(awsExports);

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const products: ProductProps[] = [
  {
    id: "123abc",
    title: "Test Product",
    tagline: "test test test",
    tags: ["Love", "Friendship"],
    customOptions: [],
    type: "Creates",
    setPrice: true,
    images: {
      cover: 1,
      collection: [
        {
          key: "123abc123",
          region: "eu-west-2",
          bucket: "test-bucket-123",
        },
        {
          key: "321cvd123",
          region: "eu-west-2",
          bucket: "test-bucket-123",
        },
      ],
    },
    description: "Test description",
    variants: [
      {
        variantName: "variant 1",
        dimensions: "20 x 20",
        price: {
          item: 20,
          postage: 5,
        },
        instructions: "Test instructions",
        features: [
          {
            name: "Images",
            featureType: "images",
            inputType: "number",
            value: {
              number: 1,
              range: [0, 0],
              array: [],
            },
          },
        ],
      },
    ],
  },
];

describe("product actions", () => {
  const store = mockStore({});

  afterEach(() => {
    store.clearActions();
  });

  describe("getProducts()", () => {
    it("should dispatch a successful action to retrieve products", () => {
      API.graphql = jest.fn().mockImplementation(() => {
        return new Promise((res) => {
          res({
            // resolve to simulate success
            data: {
              listProducts: {
                items: products,
              },
            },
          });
        });
      });

      const expectedActions = [
        {
          type: types.FETCH_PRODUCTS_REQUEST,
        },
        {
          type: types.FETCH_PRODUCTS_SUCCESS,
          products,
        },
      ];
      // @ts-ignore - error showing for "required" type even though its optional
      store.dispatch(actions.getProducts()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("should dispatch an unsuccessful action in the event of error", () => {
      API.graphql = jest.fn().mockImplementation(() => {
        return new Promise((_res, rej) => {
          rej(); // reject promise to mimic failure
        });
      });

      const expectedActions = [
        {
          type: types.FETCH_PRODUCTS_REQUEST,
        },
        {
          type: types.FETCH_PRODUCTS_FAILURE,
        },
      ];
      store.dispatch(actions.getProducts()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe("getProductByTheme()", () => {
    it("should dispatch a successful action to retrieve product based on theme", () => {
      API.graphql = jest.fn().mockImplementation(() => {
        return new Promise((res) => {
          res({
            data: {
              listProducts: {
                items: products,
              },
            },
          }); // reject promise to mimic failure
        });
      });
      const expectedActions = [
        {
          type: types.FETCH_PRODUCTS_THEME_REQUEST,
          theme: "Family",
        },
        {
          type: types.FETCH_PRODUCTS_SUCCESS,
          products,
        },
      ];
      store.dispatch(actions.getProductsByTheme("Family")).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("should dispatch an unsuccessful action in the event of an error", () => {
      API.graphql = jest.fn().mockImplementation(() => {
        return new Promise((_res, rej) => {
          rej(); // reject promise to mimic failure
        });
      });

      const expectedActions = [
        {
          type: types.FETCH_PRODUCTS_THEME_REQUEST,
          theme: "Love",
        },
        {
          type: types.FETCH_PRODUCTS_FAILURE,
        },
      ];
      store.dispatch(actions.getProductsByTheme("Love")).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe("setSearchFilters()", () => {
    it("should dispatch the correct action when successfully updating filters - test 1", () => {
      const expectedActions = [
        {
          type: types.SET_FILTERS,
          filters: {
            searchType: "all",
            sortDirection: "DESC",
            adminFilters: null,
            sortBy: "createdAt",
            shouldUpdateWithNoQuery: false,
          },
        },
      ];
      store.dispatch(
        actions.setSearchFilters({
          searchType: "all",
          sortDirection: "DESC",
          adminFilters: null,
          sortBy: "createdAt",
          shouldUpdateWithNoQuery: false,
        }),
      );
      expect(store.getActions()).toEqual(expectedActions);
    });

    it("should dispatch the correct action when successfully updating filters - test 2", () => {
      const expectedActions = [
        {
          type: types.SET_FILTERS,
          filters: {
            searchType: "all",
            sortDirection: "ASC",
            adminFilters: {
              cake: true,
              creates: true,
            },
            sortBy: "price",
            shouldUpdateWithNoQuery: false,
          },
        },
      ];
      store.dispatch(
        actions.setSearchFilters({
          searchType: "all",
          sortDirection: "ASC",
          adminFilters: {
            cake: true,
            creates: true,
          },
          sortBy: "price",
          shouldUpdateWithNoQuery: false,
        }),
      );
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
