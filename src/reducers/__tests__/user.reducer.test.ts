import reducer from "../user.reducer";
import * as types from "../../interfaces/user.redux.i";

describe("user actions", () => {
  it("should return the initial state", () => {
    // @ts-ignore
    expect(reducer(undefined, {})).toEqual({ id: null });
  });

  it("should handle SET_USER", () => {
    expect(
      reducer(undefined, {
        type: types.SET_USER,
        id: "123",
      }),
    ).toEqual({
      id: "123",
    });
  });

  it("should handle CLEAR_USER", () => {
    expect(
      reducer(
        { id: "123" },
        {
          type: types.CLEAR_USER,
        },
      ),
    ).toEqual({
      id: null,
    });
  });
});
