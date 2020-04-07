import * as actions from "../user.actions";
import * as types from "../../interfaces/user.redux.i";

describe("user actions", () => {
  it("should create an action to set the id to the store", () => {
    const expectedAction = {
      type: types.SET_USER,
      id: "123abc",
    };
    expect(actions.setUser("123abc")).toEqual(expectedAction);
  });

  it("should create an action to clear the user from the store", () => {
    const expectedAction = {
      type: types.CLEAR_USER,
    };
    expect(actions.clearUser()).toEqual(expectedAction);
  });
});
