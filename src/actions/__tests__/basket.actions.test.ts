import * as actions from "../basket.actions";
import * as types from "../../interfaces/basket.redux.i";

describe("basket actions", () => {
  it("should create an action to add an item to the basket", () => {
    const item = {
      id: "123",
      title: "Test title",
      description: "Test description",
      price: 25,
      shippingCost: 2.5,
      image: null,
      type: "Cake",
    };
    const expectedAction = {
      type: types.ADD_ITEM_TO_BASKET,
      item,
    };
    expect(actions.addToBasket(item)).toEqual(expectedAction);
  });

  it("should create an action to remove an item from the basket", () => {
    const expectedAction = {
      type: types.REMOVE_ITEM_FROM_BASKET,
      itemID: "123abc",
    };
    expect(actions.removeFromBasket("123abc")).toEqual(expectedAction);
  });

  it("should create an action to clear the basket", () => {
    const expectedAction = {
      type: types.CLEAR_BASKET,
    };
    expect(actions.clearBasket()).toEqual(expectedAction);
  });
});
