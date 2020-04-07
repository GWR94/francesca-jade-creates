import React from "react";
import { shallow } from "enzyme";
import { Popover, Menu } from "@blueprintjs/core";
import configureStore from "redux-mock-store";
import ConnectedNavBar, { NavBar } from "../NavBar";
import * as actions from "../../actions/basket.actions";
import * as types from "../../interfaces/basket.redux.i";
import reducer from "../../reducers/basket.reducer";

describe("<NavBar />", () => {
  // mock logout and setAccounts functions to test they are being called
  const logout = jest.fn();
  const setAccounts = jest.fn();

  const initialState = {
    basket: {
      items: [],
      cost: 0,
    },
    user: {
      id: null,
    },
  };

  const firstItem = {
    id: "123",
    title: "first",
    description: "test desc",
    price: 6,
    shippingCost: 4,
    image: null,
    type: "Cake",
  };

  const secondItem = {
    id: "321",
    title: "second",
    description: "test desc",
    price: 6,
    shippingCost: 4,
    image: null,
    type: "Cake",
  };

  describe("test cases for UNCONNECTED component's rendering and snapshots", () => {
    it("should render correctly when user IS admin", () => {
      const wrapper = shallow(
        <NavBar
          signOut={logout}
          setAccountsTab={setAccounts}
          // @ts-ignore
          user={{
            username: "test",
          }}
          userAttributes={{
            sub: "123",
          }}
          admin
          items={[]}
          cost={0}
        />,
      );
      expect(wrapper).toMatchSnapshot();
      // test all text is correct for admin user
      expect(wrapper.find(Popover).at(0).childAt(0).text()).toBe("Account");
      // "Profile" should be in all navbar instances - ie admin/not admin.
      expect(wrapper.find(Menu).at(0).childAt(0).prop("text")).toBe("Profile");
      // expect "Products" to show - which is an admin only option.
      expect(wrapper.find(Menu).at(0).childAt(1).prop("text")).toBe("Products");
      // expect "Create Product" to show - which is an admin only option.
      expect(wrapper.find(Menu).at(0).childAt(2).prop("text")).toBe("Create Product");
      // "Logout" should be in all navbar instances - ie admin/not admin.
      expect(wrapper.find(Menu).at(0).childAt(4).prop("text")).toBe("Logout");
      // check basket is empty
      expect(wrapper.find(Popover).at(1).childAt(0).text()).toBe("Basket (0)");
      expect(wrapper.find(".nav__basket").at(0).childAt(1).text()).toBe(
        "Basket is empty.",
      );
    });

    it("should render correctly when user is NOT admin", () => {
      const wrapper = shallow(
        <NavBar
          signOut={logout}
          setAccountsTab={setAccounts}
          // @ts-ignore
          user={{
            username: "test",
          }}
          userAttributes={{
            sub: "123",
          }}
          items={[]}
          cost={0}
        />,
      );
      expect(wrapper).toMatchSnapshot();
      // find account tab
      expect(wrapper.find(Popover).at(0).childAt(0).text()).toBe("Account");
      // "Profile" should be in all navbar instances - ie admin/not admin.
      expect(wrapper.find(Menu).at(0).childAt(0).prop("text")).toBe("Profile");
      // expect "Orders" to show, which is a non-admin only property
      expect(wrapper.find(Menu).at(0).childAt(1).prop("text")).toBe("Orders");
      // "Logout" should be in all navbar instances - ie admin/not admin.
      expect(wrapper.find(Menu).at(0).childAt(3).prop("text")).toBe("Logout");
      // check basket is empty
      expect(wrapper.find(Popover).at(1).childAt(0).text()).toBe("Basket (0)");
      expect(wrapper.find(".nav__basket").at(0).childAt(1).text()).toBe(
        "Basket is empty.",
      );
    });

    it("should open popover when clicking the account nav link, then close when clicking again", () => {
      const wrapper = shallow(
        <NavBar
          signOut={logout}
          setAccountsTab={setAccounts}
          // @ts-ignore
          user={{ username: "test" }}
          userAttributes={{ sub: "123" }}
          admin
          items={[]}
        />,
      );
      // open accounts popover
      wrapper.find(Popover).at(0).childAt(0).simulate("click");
      // should set menu open to true
      expect(wrapper.state("menuOpen")).toBeTruthy();
      // click the same popover
      wrapper.find(Popover).at(0).childAt(0).simulate("click");
      // should close menu with menuOpen being false
      expect(wrapper.state("menuOpen")).toBeFalsy();
    });

    it("should call the logout function when clicking the button", () => {
      const wrapper = shallow(
        <NavBar
          signOut={logout}
          setAccountsTab={setAccounts}
          // @ts-ignore
          user={{ username: "test" }}
          userAttributes={{ sub: "123" }}
          admin
          items={[]}
        />,
      );
      wrapper.find(".nav__logout").at(0).simulate("click");
      expect(logout).toHaveBeenCalledTimes(1);
    });

    it("should show items in basket NavLink text when they are present in props, and show up in the popover", () => {
      const wrapper = shallow(
        <NavBar
          signOut={logout}
          setAccountsTab={setAccounts}
          // @ts-ignore
          user={{ username: "test" }}
          userAttributes={{ sub: "123" }}
          admin
          items={[]}
          cost={0}
        />,
      );
      // check basket is empty and shows correct text inside popover
      expect(wrapper.find(Popover).at(1).childAt(0).text()).toBe("Basket (0)");
      expect(wrapper.find(".nav__basket").at(0).childAt(1).text()).toBe(
        "Basket is empty.",
      );
      // add item to props
      wrapper.setProps({
        items: [firstItem],
      });
      // popover root should show there is an item in the basket
      expect(wrapper.find(Popover).at(1).childAt(0).text()).toBe("Basket (1)");
      // nav__basket should have the item in the basket popover.
      expect(wrapper.find(".nav__basket").at(0).childAt(1).childAt(0).text()).toBe("1.");
      expect(wrapper.find(".nav__basket-details").at(0).text()).toBe(
        "first - £6.00 + £4.00",
      );
      // add another item to items
      wrapper.setProps({
        items: [firstItem, secondItem],
      });
      // popover content should show this is added to basket with details.
      expect(wrapper.find(Popover).at(1).childAt(0).text()).toBe("Basket (2)");
      expect(wrapper.find(".nav__basket-details").at(1).text()).toBe(
        "second - £6.00 + £4.00",
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("test suite for actions, snapshots and state changes when dispatching actions in CONNECTED component", () => {
    let wrapper;
    // mock store to test actions are created/dispatched.
    const mockStore = configureStore();
    let store;
    // before each test, reset store to initial state and clear actions.
    beforeEach(() => {
      store = mockStore(initialState);
      wrapper = shallow(
        <ConnectedNavBar
          signOut={logout}
          setAccountsTab={setAccounts}
          // @ts-ignore
          user={{ username: "test" }}
          userAttributes={{ sub: "123" }}
          admin
          store={store}
        />,
      );
    });

    it("should render the connected NavBar component properly", () => {
      expect(wrapper.find(NavBar).length).toBe(1);
      expect(wrapper).toMatchSnapshot();
    });

    it("should dispatch actions to mock store and update state when ADDING to basket", () => {
      expect(wrapper).toMatchSnapshot();
      // add first item to store
      store.dispatch(actions.addToBasket(firstItem));
      // check action is in store
      expect(store.getActions()[0].type).toBe(types.ADD_ITEM_TO_BASKET);
      const expectedState = {
        items: [...initialState.basket.items, firstItem],
        cost: 10,
      };
      // test reducer sets store to correct state
      expect(
        reducer(initialState.basket, { type: types.ADD_ITEM_TO_BASKET, item: firstItem }),
      ).toEqual(expectedState);
      // add another item
      store.dispatch(actions.addToBasket(secondItem));
      // check action is in store
      expect(store.getActions()[1].type).toBe(types.ADD_ITEM_TO_BASKET);
      // check reducer updates state with the second item
      expect(
        reducer(expectedState, { type: types.ADD_ITEM_TO_BASKET, item: secondItem }),
      ).toEqual({
        items: [...expectedState.items, secondItem],
        cost: 20,
      });
    });

    it("should dispatch actions to mock store and update state when REMOVING from basket", () => {
      const initialState = {
        items: [firstItem, secondItem],
        cost: 20,
      };
      // remove first item (id is 123)
      store.dispatch(actions.removeFromBasket("123"));
      // expect action to be dispatched in store
      expect(store.getActions()[0].type).toBe(types.REMOVE_ITEM_FROM_BASKET);
      // expect reducer to show state with first item removed
      expect(
        reducer(initialState, { type: types.REMOVE_ITEM_FROM_BASKET, itemID: "123" }),
      ).toEqual({
        items: [secondItem],
        cost: 10,
      });
      // test with one item in store
      const updatedState = {
        items: [secondItem],
        cost: 10,
      };
      store.dispatch(actions.removeFromBasket("321"));
      // should return empty store with cost updated
      expect(
        reducer(updatedState, { type: types.REMOVE_ITEM_FROM_BASKET, itemID: "321" }),
      ).toEqual({
        items: [],
        cost: 0,
      });
      // test where there are no items in array and still trying to remove => shouldn't fail
      expect(
        reducer(
          { items: [], cost: 0 },
          { type: types.REMOVE_ITEM_FROM_BASKET, itemID: "123" },
        ),
      ).toEqual({ items: [], cost: 0 });
    });

    it("should dispatch actions to mock store and update when CLEARING basket", () => {
      // create variable which the store will be in initially
      const initialState = {
        items: [firstItem, secondItem],
        cost: 20,
      };
      // dispatch the clearBasket action
      store.dispatch(actions.clearBasket());
      // expect the first item actions to be of the same type
      expect(store.getActions()[0].type).toBe(types.CLEAR_BASKET);
      // test reducer to see if it's cleared all items and reset cost
      expect(reducer(initialState, { type: types.CLEAR_BASKET })).toEqual({
        items: [],
        cost: 0,
      });
      // same test with one item in store
      expect(
        reducer({ items: [firstItem], cost: 0 }, { type: types.CLEAR_BASKET }),
      ).toEqual({
        items: [],
        cost: 0,
      });
      // should still function when action is dispatched but theres an empty store
      expect(reducer({ items: [], cost: 0 }, { type: types.CLEAR_BASKET })).toEqual({
        items: [],
        cost: 0,
      });
    });
  });
});
