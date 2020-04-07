import reducer from "../basket.reducer";
import * as types from "../../interfaces/basket.redux.i";

describe("basket reducer", () => {
  it("should return the initial state", () => {
    // @ts-ignore
    expect(reducer(undefined, {})).toEqual({ items: [], cost: 0 });
  });

  it("should handle ADD_ITEM_TO_BASKET", () => {
    expect(
      reducer(undefined, {
        type: types.ADD_ITEM_TO_BASKET,
        item: {
          id: "123",
          title: "test",
          description: "test desc",
          image: null,
          price: 5,
          shippingCost: 5,
          type: "Cake",
        },
      }),
    ).toEqual({
      items: [
        {
          id: "123",
          title: "test",
          description: "test desc",
          image: null,
          price: 5,
          shippingCost: 5,
          type: "Cake",
        },
      ],
      cost: 10,
    });
  });

  it("should handle REMOVE_ITEM_FROM_BASKET", () => {
    expect(
      reducer(
        {
          items: [
            {
              id: "123",
              title: "test",
              description: "test desc",
              image: null,
              price: 5,
              shippingCost: 5,
              type: "Cake",
            },
          ],
          cost: 10,
        },
        {
          type: types.REMOVE_ITEM_FROM_BASKET,
          itemID: "123",
        },
      ),
    ).toEqual({
      items: [],
      cost: 0,
    });
  });

  it("should handle CLEAR_BASKET", () => {
    expect(
      reducer(
        {
          items: [
            {
              id: "123",
              title: "test",
              description: "test desc",
              image: null,
              price: 5,
              shippingCost: 5,
              type: "Cake",
            },
            {
              id: "456",
              title: "test",
              description: "test desc",
              image: null,
              price: 5,
              shippingCost: 5,
              type: "Cake",
            },
            {
              id: "678",
              title: "test",
              description: "test desc",
              image: null,
              price: 5,
              shippingCost: 5,
              type: "Cake",
            },
          ],
          cost: 30,
        },
        {
          type: types.CLEAR_BASKET,
        },
      ),
    ).toEqual({
      items: [],
      cost: 0,
    });
  });
});
