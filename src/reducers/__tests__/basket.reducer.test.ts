import reducer, { BasketState } from "../basket.reducer";
import * as types from "../../interfaces/basket.redux.i";
import {
  createsBasketOne,
  createsBasketTwo,
  createsBasketThree,
  createsCheckoutOne,
  createsCheckoutTwo,
} from "../../__mocks__/products";

const initialState: BasketState = {
  items: [],
  checkout: {
    products: [],
    cost: 0,
  },
};

describe("Basket reducer", () => {
  it("should return the initial state", () => {
    // @ts-ignore
    expect(reducer(initialState, {})).toEqual({
      items: [],
      checkout: {
        products: [],
        cost: 0,
      },
    });
  });

  describe("ADD_ITEM_TO_BASKET", () => {
    it("should handle ADD_ITEM_TO_BASKET", () => {
      expect(
        reducer(initialState, {
          type: types.ADD_ITEM_TO_BASKET,
          item: createsBasketOne,
        }),
      ).toEqual({
        items: [createsBasketOne],
        checkout: {
          products: [],
          cost: 0,
        },
      });
    });
  });

  describe("REMOVE_ITEM_FROM_BASKET", () => {
    it("should handle REMOVE_ITEM_FROM_BASKET when there is only one item", () => {
      expect(
        reducer(
          {
            items: [createsBasketOne],
            checkout: {
              products: [],
              cost: 0,
            },
          },
          {
            type: types.REMOVE_ITEM_FROM_BASKET,
            itemID: "123",
          },
        ),
      ).toEqual({
        items: [],
        checkout: {
          products: [],
          cost: 0,
        },
      });
    });

    it("should handle REMOVE_ITEM_FROM_BASKET when there is more than one item", () => {
      expect(
        reducer(
          {
            items: [createsBasketOne, createsBasketTwo],
            checkout: {
              products: [],
              cost: 0,
            },
          },
          {
            type: types.REMOVE_ITEM_FROM_BASKET,
            itemID: "123",
          },
        ),
      ).toEqual({
        items: [createsBasketTwo],
        checkout: {
          products: [],
          cost: 0,
        },
      });
    });

    it("should not throw an error when trying to remove an item from an empty array", () => {
      expect(
        reducer(
          {
            items: [],
            checkout: {
              products: [],
              cost: 0,
            },
          },
          {
            type: types.REMOVE_ITEM_FROM_BASKET,
            itemID: "123",
          },
        ),
      ).toEqual({
        items: [],
        checkout: {
          products: [],
          cost: 0,
        },
      });
    });
  });

  describe("CLEAR_BASKET", () => {
    it("should handle CLEAR_BASKET with a full basket", () => {
      expect(
        reducer(
          {
            items: [createsBasketOne, createsBasketTwo, createsBasketThree],
            checkout: {
              products: [],
              cost: 0,
            },
          },
          {
            type: types.CLEAR_BASKET,
          },
        ),
      ).toEqual({
        items: [],
        checkout: {
          products: [],
          cost: 0,
        },
      });
    });

    it("should handle CLEAR_BASKET with no errors with an empty basket", () => {
      expect(
        reducer(
          {
            items: [],
            checkout: {
              products: [],
              cost: 0,
            },
          },
          {
            type: types.CLEAR_BASKET,
          },
        ),
      ).toEqual({
        items: [],
        checkout: {
          products: [],
          cost: 0,
        },
      });
    });
  });

  describe("ADD_ITEM_TO_CHECKOUT", () => {
    it("should handle ADD_ITEM_TO_CHECKOUT", () => {
      expect(
        reducer(initialState, {
          type: types.ADD_ITEM_TO_CHECKOUT,
          product: createsCheckoutOne,
        }),
      ).toEqual({
        items: [],
        checkout: {
          products: [createsCheckoutOne],
          cost: 25,
        },
      });
    });
  });

  describe("REMOVE_ITEM_FROM_CHECKOUT", () => {
    it("should handle REMOVE_ITEM_FROM_CHECKOUT with one item in array", () => {
      expect(
        reducer(
          {
            items: [createsBasketOne],
            checkout: {
              products: [createsCheckoutOne],
              cost: 25,
            },
          },
          {
            type: types.REMOVE_ITEM_FROM_CHECKOUT,
            itemID: "123",
          },
        ),
      ).toEqual({
        items: [createsBasketOne],
        checkout: {
          products: [],
          cost: 0,
        },
      });
    });

    it("should handle REMOVE_ITEM_FROM_CHECKOUT with multiple items in array", () => {
      expect(
        reducer(
          {
            items: [],
            checkout: {
              products: [createsCheckoutOne, createsCheckoutTwo],
              cost: 40,
            },
          },
          {
            type: types.REMOVE_ITEM_FROM_CHECKOUT,
            itemID: "123",
          },
        ),
      ).toEqual({
        items: [],
        checkout: {
          products: [createsCheckoutTwo],
          cost: 15,
        },
      });
    });

    it("should handle REMOVE_ITEM_FROM_CHECKOUT with no items in array", () => {
      expect(
        reducer(initialState, {
          type: types.REMOVE_ITEM_FROM_CHECKOUT,
          itemID: "123",
        }),
      ).toEqual(initialState);
    });
  });

  describe("CLEAR_CHECKOUT", () => {
    it("should handle CLEAR_CHECKOUT with a populated products array", () => {
      expect(
        reducer(
          {
            items: [],
            checkout: {
              products: [createsCheckoutOne, createsCheckoutTwo],
              cost: 40,
            },
          },
          {
            type: types.CLEAR_CHECKOUT,
          },
        ),
      ).toEqual(initialState);
    });

    it("should handle CLEAR_CHECKOUT with an empty products array", () => {
      expect(
        reducer(initialState, {
          type: types.CLEAR_CHECKOUT,
        }),
      ).toEqual(initialState);
    });
  });

  describe("SET_VARIANT", () => {
    it("should handle SET_VARIANT correctly", () => {
      expect(
        reducer(
          {
            items: [],
            checkout: {
              products: [createsCheckoutOne],
              cost: 25,
            },
          },
          {
            type: types.SET_VARIANT,
            id: "123",
            variant: {
              dimensions: "30cm x 30cm",
              price: {
                item: 30,
                postage: 5,
              },
              features: [],
              variantName: "Larger square frame",
              instructions: "test abc",
            },
          },
        ),
      ).toEqual({
        items: [],
        checkout: {
          products: [
            {
              ...createsCheckoutOne,
              variant: {
                dimensions: "30cm x 30cm",
                price: {
                  item: 30,
                  postage: 5,
                },
                features: [],
                variantName: "Larger square frame",
                instructions: "test abc",
              },
            },
          ],
          cost: 35,
        },
      });
    });
    describe("ADD_CUSTOM_OPTIONS_TO_PRODUCT", () => {
      it("should handle ADD_CUSTOM_OPTIONS_TO_PRODUCT when referencing the only item in array", () => {
        expect(
          reducer(
            {
              items: [],
              checkout: {
                products: [createsCheckoutOne],
                cost: 25,
              },
            },
            {
              type: types.ADD_CUSTOM_OPTIONS_TO_PRODUCT,
              id: "123",
              customOptions: [
                {
                  name: "Frank",
                },
                {
                  message: "Happy Birthday!",
                },
              ],
            },
          ),
        ).toEqual({
          items: [],
          checkout: {
            products: [
              {
                ...createsCheckoutOne,
                customOptions: [
                  {
                    name: "Frank",
                  },
                  {
                    message: "Happy Birthday!",
                  },
                ],
              },
            ],
            cost: 25,
          },
        });
      });
      it("should handle ADD_CUSTOM_OPTIONS_TO_PRODUCT when the array is populated", () => {
        expect(
          reducer(
            {
              items: [],
              checkout: {
                products: [createsCheckoutOne, createsCheckoutTwo],
                cost: 40,
              },
            },
            {
              type: types.ADD_CUSTOM_OPTIONS_TO_PRODUCT,
              id: "123",
              customOptions: [
                {
                  name: "John",
                },
                {
                  message: "Happy Birthday!",
                },
              ],
            },
          ),
        );
      });
    });
  });
});
