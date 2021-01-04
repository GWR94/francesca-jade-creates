import React from "react";
import { shallow } from "enzyme";
import { Tag, Button } from "@blueprintjs/core";
import configureStore from "redux-mock-store";
import ConnectedViewProduct, {
  ViewProduct,
} from "../../pages/accounts/components/ViewProduct";
import Loading from "../Loading";
import { cakeProduct, createsProduct, userAttributes } from "../../__mocks__/products";
import ImageCarousel from "../containers/ImageCarousel";
import { AppState } from "../../store/store";
import * as types from "../../interfaces/basket.redux.i";

describe("<ViewProduct />", () => {
  describe("test cases for unconnected ViewProduct component", () => {
    it("should render the loading component when there is no product", () => {
      const wrapper = shallow<ViewProduct>(
        <ViewProduct id="123" userAttributes={userAttributes} />,
      );
      expect(wrapper.find(Loading).length).toBe(1);
      expect(wrapper).toMatchSnapshot();
    });

    it("should render correctly when injecting product with no set price into state", () => {
      const wrapper = shallow<ViewProduct>(
        <ViewProduct id={cakeProduct.id} userAttributes={userAttributes} />,
      );
      // inject product into state
      wrapper.setState({ product: cakeProduct });
      expect(wrapper).toMatchSnapshot();
      // expect title to be correct based on product
      expect(wrapper.find("h3.view__title").text()).toBe("Racing Cake");
      // expect description to be correct based on product
      expect(wrapper.find(".view__description").text()).toBe(
        "Test test test test test test",
      );
      // expect all children to be of type tag and have the correct text in them.
      expect(wrapper.find(".view__tags").childAt(0).type()).toBe(Tag);
      expect(wrapper.find(Tag).at(0).childAt(0).text()).toBe(cakeProduct.tags[0]);
      expect(wrapper.find(".view__tags").childAt(1).type()).toBe(Tag);
      expect(wrapper.find(Tag).at(1).childAt(0).text()).toBe(cakeProduct.tags[1]);
      // expect image carousel prop "images" to match the products image prop
      expect(wrapper.find(ImageCarousel).prop("images")).toBe(cakeProduct.image);
      // expect price to show correct text based on product
      expect(wrapper.find(".view__price").childAt(0).text()).toBe(
        "Please send a request with your personalisation preferences, and I will get back to you as soon as possible with a quote.",
      );
      // expect there to only be one button when there is no set price
      expect(wrapper.find(Button).length).toBe(1);
      // expect the button to have "success" intent prop
      expect(wrapper.find(Button).prop("intent")).toBe("success");
      // expect the icon prop to be correct based on the product
      expect(wrapper.find(Button).prop("icon")).toStrictEqual(
        <i className="fas fa-credit-card view__icon" />,
      );
      // expect second child of button to be the correct text
      expect(wrapper.find(Button).prop("text")).toBe("Request a Quote");
    });

    it("should render correctly when injecting product with set price into state", () => {
      const wrapper = shallow<ViewProduct>(
        <ViewProduct id={createsProduct.id} userAttributes={userAttributes} />,
      );
      // inject product into state
      wrapper.setState({ product: createsProduct });
      expect(wrapper).toMatchSnapshot();
      // expect title to be correct based on product
      expect(wrapper.find("h3.view__title").text()).toBe(createsProduct.title);
      // expect description to be correct based on product
      expect(wrapper.find(".view__description").text()).toBe(createsProduct.description);
      // expect all children to be of type tag and have the correct text in them.
      expect(wrapper.find(".view__tags").childAt(0).type()).toBe(Tag);
      expect(wrapper.find(Tag).at(0).childAt(0).text()).toBe(createsProduct.tags[0]);
      expect(wrapper.find(".view__tags").childAt(1).type()).toBe(Tag);
      expect(wrapper.find(Tag).at(1).childAt(0).text()).toBe(createsProduct.tags[1]);
      // expect image carousel prop "images" to match the products image prop
      expect(wrapper.find(ImageCarousel).prop("images")).toBe(createsProduct.image);
      // expect price to show correct text based on product price
      expect(wrapper.find(".view__price").childAt(0).text()).toBe(
        `The cost for ${createsProduct.title} is £${createsProduct.price.toFixed(
          2,
        )} + £${createsProduct.shippingCost.toFixed(2)} postage and packaging`,
      );
      // expect there to only be one button
      expect(wrapper.find(Button).length).toBe(1);
      // expect the button to have "success" intent prop
      expect(wrapper.find(Button).prop("intent")).toBe("primary");
      // expect the icon prop to be correct based on the prop
      expect(wrapper.find(Button).prop("icon")).toStrictEqual(
        <i className="fas fa-shopping-cart view__icon" />,
      );
      // expect text of button to be correct for adding to basket
      expect(wrapper.find(Button).prop("text")).toBe("Add to Basket");
    });
  });

  describe("test cases for connected ViewProduct component", () => {
    let wrapper;
    // mock store to test actions are created/dispatched.
    const mockStore = configureStore();
    let store;
    const initialState: AppState = {
      basket: {
        items: [],
        cost: 0,
      },
      user: {
        id: null,
      },
    };
    // before each test, reset store to initial state and clear actions.
    beforeEach(() => {
      store = mockStore(initialState);
      wrapper = shallow(
        <ConnectedViewProduct id="123" userAttributes={userAttributes} store={store} />,
      );
    });

    it("should render correctly", () => {
      expect(wrapper.find(ViewProduct).length).toBe(1);
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.prop("store").getState()).toBe(initialState);
    });

    it("should dispatch actions to mock store and update state", () => {
      wrapper = wrapper.dive();
      wrapper.setState({ product: createsProduct });
      expect(wrapper).toMatchSnapshot();
      wrapper.find(Button).simulate("click");
      const { id, title, description, price, shippingCost, image, type } = createsProduct;
      expect(store.getActions()[0]).toStrictEqual({
        type: types.ADD_ITEM_TO_BASKET,
        item: {
          id,
          title,
          description,
          price,
          shippingCost,
          image,
          type,
        },
      });
    });
  });
});
