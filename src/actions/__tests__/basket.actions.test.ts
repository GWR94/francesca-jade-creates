import { BasketItemProps } from "../../pages/payment/interfaces/Basket.i";
import * as actions from "../basket.actions";
import * as types from "../../interfaces/basket.redux.i";

describe("basket actions", () => {
  describe("addToBasket()", () => {
    it("should create an action to add an item to the basket", () => {
      const item: BasketItemProps = {
        id: "123",
        title: "Test title",
        tagline: "Test tagline",
        description: "Test description",
        image: {
          bucket: "testbucket",
          key: "123abc",
          region: "eu-west-2",
        },
        type: "Cake",
        variants: [],
        customOptions: [],
      };
      const expectedAction = {
        type: types.ADD_ITEM_TO_BASKET,
        item,
      };
      expect(actions.addToBasket(item)).toEqual(expectedAction);
    });
  });

  describe("removeFromBasket()", () => {
    it("should create an action to remove an item from the basket", () => {
      const expectedAction = {
        type: types.REMOVE_ITEM_FROM_BASKET,
        itemID: "123abc",
      };
      expect(actions.removeFromBasket("123abc")).toEqual(expectedAction);
    });
  });

  describe("clearBasket()", () => {
    it("should create an action to clear the basket", () => {
      const expectedAction = {
        type: types.CLEAR_BASKET,
      };
      expect(actions.clearBasket()).toEqual(expectedAction);
    });
  });
});
