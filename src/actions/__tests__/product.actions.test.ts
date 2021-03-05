import { fetchProductsSuccess } from "./../products.actions";
import axios from "axios";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import MockAdapter from "axios-mock-adapter";
import moxios from "moxios";
import * as actions from "../../actions/products.actions";
import * as types from "../../interfaces/products.redux.i";
import { ProductProps } from "../../pages/accounts/interfaces/Product.i";
import { Dispatch } from "redux";

const getProducts = () => (dispatch: Dispatch): Promise<void> => {
  dispatch(actions.getProducts());
  return axios
    .get("/products")
    .then((response) => {
      dispatch(actions.fetchProductsSuccess(response.data));
      return response;
    })
    .catch((error) => {
      dispatch(actions.fetchProductsFailure());
      console.log(error);
      return error;
    });
};

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
  beforeEach(() => {
    // store.clearActions();
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe("getProducts()", () => {
    it("should dispatch an action to retrieve products and put them into store", () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: products[0],
        });
      });
      const store = mockStore({});

      const expectedActions = [
        {
          type: types.GET_PRODUCTS,
        },
        {
          type: types.FETCH_PRODUCTS_SUCCESS,
          products: [products[0]],
        },
      ];

      return store.dispatch(actions.getProducts()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
