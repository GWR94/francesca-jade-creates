import * as actions from "../user.actions";
import * as types from "../../interfaces/user.redux.i";

describe("user actions", () => {
  describe("setUser()", () => {
    it("should create an action to set the user into the store", () => {
      const expectedAction = {
        type: types.SET_USER,
        id: "123abc",
        username: "jamesgower",
        admin: true,
        email: "test@test.com",
        emailVerified: true,
      };
      expect(actions.setUser("123abc", true)).toEqual(expectedAction);
    });
  });

  describe("clearUser()", () => {
    it("should create an action to clear the user from the store", () => {
      const expectedAction = {
        type: types.CLEAR_USER,
      };
      expect(actions.clearUser()).toEqual(expectedAction);
    });
  });

  describe("setCurrentTab()", () => {
    it("should create an action to set the current tab into store", () => {
      const expectedAction = {
        type: types.SET_CURRENT_TAB,
        currentTab: "orders",
      };
      expect(actions.setCurrentTab("orders")).toEqual(expectedAction);
    });
  });
});
