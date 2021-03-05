import React, { useState as useStateMock } from "react";
import { shallow } from "enzyme";
import { Card, Button } from "@material-ui/core";
import { S3Image } from "aws-amplify-react";
import ProductCard from "../containers/ProductCard";
import { history } from "../../routes/Router";
import ChipContainer from "../inputs/ChipContainer";
import { cakeProduct, createsProduct } from "../../__mocks__/products";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

describe("<ProductCard />", () => {
  const setState = jest.fn();

  beforeEach(() => {
    // @ts-ignore
    useStateMock.mockImplementation((init) => [init, setState]);
  });

  it('should render correctly when user IS admin and the product is of type "Cake"', () => {
    // create shallow wrapper
    const wrapper = shallow(<ProductCard product={cakeProduct} admin />);
    // match snapshot
    expect(wrapper).toMatchSnapshot();
    // find card
    const card = wrapper.find(Card);
    // expect one instance of card to be in wrapper.
    expect(wrapper.find(Card).length).toBe(1);
    // expect the birthday cake icon when the product type is a cake
    expect(card.childAt(0).prop("className")).toBe("fas fa-birthday-cake product__icon");
    // expect the correct icon styles for a cake
    expect(card.childAt(0).prop("style")).toStrictEqual({
      color: "#fd4ef2",
    });
    // expect the correct title
    expect(wrapper.find(".product__title").text()).toBe("Racing Cake");
    // expect the correct price
    expect(wrapper.find(".product__price").text()).toBe("Customer requests quote");
    expect(wrapper.find(S3Image).length).toBe(1);
    expect(wrapper.find(S3Image).prop("imgKey")).toBe(cakeProduct.image[0].key);
    // expect the tags to be correct for the current product
    expect(wrapper.find(ChipContainer).prop("tags")).toStrictEqual(["Cake", "Racing"]);
    // expect there to be two children in the button container
    expect(wrapper.find(".new-product__button-container").children().length).toBe(2);
    // expect both children to be of type Button.
    expect(wrapper.find(".new-product__button-container").childAt(0).type()).toBe(Button);
    expect(wrapper.find(".new-product__button-container").childAt(1).type()).toBe(Button);
    // expect first button to have "Delete" text, which is an admin only option
    expect(wrapper.find(Button).at(0).prop("text")).toBe("Delete");
    // expect first button to have "Edit" text, which is an admin only option
    expect(wrapper.find(Button).at(1).prop("text")).toBe("Edit");
    // mock stopPropagation so it doesn't fail in test
    const stopPropagation = jest.fn();
    // simulate delete button click
    wrapper.find(Button).at(0).simulate("click", {
      stopPropagation,
    });
    // expect setState (alertOpen) to have been called one time with true as the parameter.
    expect(setState).toHaveBeenCalledWith(true);
  });

  it('should render correctly when user IS admin and the product is of type "Creates"', () => {
    // create shallow wrapper
    const wrapper = shallow(
      <ProductCard product={createsProduct} admin history={history} />,
    );
    // match snapshot
    expect(wrapper).toMatchSnapshot();
    // find card
    const card = wrapper.find(Card);
    // expect one instance of card to be in wrapper.
    expect(wrapper.find(Card).length).toBe(1);
    // expect the pencil icon when the product type is a creation.
    expect(card.childAt(0).prop("className")).toBe("fas fa-pencil-alt product__icon");
    // expect the correct icon styles for a cake
    expect(card.childAt(0).prop("style")).toStrictEqual({
      color: "#9370f6",
    });
    // expect the correct title
    expect(wrapper.find(".product__title").text()).toBe("Name Frame");
    // expect the correct price
    expect(wrapper.find(".product__price").text()).toBe("£14.50 + £4.50 postage");
    expect(wrapper.find(S3Image).length).toBe(1);
    expect(wrapper.find(S3Image).prop("imgKey")).toBe(createsProduct.image[0].key);
    // expect the tags to be correct for the current product
    expect(wrapper.find(ChipContainer).prop("tags")).toStrictEqual([
      "Personalised",
      "Name",
      "Frame",
    ]);
    // expect there to be two children in the button container
    expect(wrapper.find(".new-product__button-container").children().length).toBe(2);
    // expect both children to be of type Button.
    expect(wrapper.find(".new-product__button-container").childAt(0).type()).toBe(Button);
    expect(wrapper.find(".new-product__button-container").childAt(1).type()).toBe(Button);
    // expect first button to have "Delete" text, which is an admin only option
    expect(wrapper.find(Button).at(0).prop("text")).toBe("Delete");
    // expect first button to have "Edit" text, which is an admin only option
    expect(wrapper.find(Button).at(1).prop("text")).toBe("Edit");
    // mock stopPropagation so it doesn't fail in test
    const stopPropagation = jest.fn();
    // simulate delete button click
    wrapper.find(Button).at(0).simulate("click", {
      stopPropagation,
    });
    // expect setState (alertOpen) to have been called one time with true as the parameter.
    expect(setState).toHaveBeenCalledWith(true);
  });

  it("should render correctly when the user is NOT an admin and the product is of type 'Cake'", () => {
    // create shallow wrapper
    const wrapper = shallow(<ProductCard product={cakeProduct} history={history} />);
    // match snapshot
    expect(wrapper).toMatchSnapshot();
    // find card
    const card = wrapper.find(Card);
    // expect one instance of card to be in wrapper.
    expect(wrapper.find(Card).length).toBe(1);
    // expect the birthday cake icon when the product type is a cake
    expect(card.childAt(0).prop("className")).toBe("fas fa-birthday-cake product__icon");
    // expect the correct icon styles for a cake
    expect(card.childAt(0).prop("style")).toStrictEqual({
      color: "#fd4ef2",
    });
    // expect the correct title
    expect(wrapper.find(".product__title").text()).toBe("Racing Cake");
    // expect the correct price
    expect(wrapper.find(".product__price").text()).toBe("Customer requests quote");
    expect(wrapper.find(S3Image).length).toBe(1);
    expect(wrapper.find(S3Image).prop("imgKey")).toBe(cakeProduct.image[0].key);
    // expect the tags to be correct for the current product
    expect(wrapper.find(ChipContainer).prop("tags")).toStrictEqual(["Cake", "Racing"]);
  });

  it("should render correctly when the user is NOT admin and product type is 'Creates'", () => {
    const wrapper = shallow(<ProductCard product={createsProduct} history={history} />);
    // match snapshot
    expect(wrapper).toMatchSnapshot();
    // find card
    const card = wrapper.find(Card);
    // expect one instance of card to be in wrapper.
    expect(wrapper.find(Card).length).toBe(1);
    // expect the pencil icon when the product type is a creation.
    expect(card.childAt(0).prop("className")).toBe("fas fa-pencil-alt product__icon");
    // expect the correct icon styles for a cake
    expect(card.childAt(0).prop("style")).toStrictEqual({
      color: "#9370f6",
    });
    // expect the correct title
    expect(wrapper.find(".product__title").text()).toBe("Name Frame");
    // expect the correct price
    expect(wrapper.find(".product__price").text()).toBe("£14.50 + £4.50 postage");
    expect(wrapper.find(S3Image).length).toBe(1);
    expect(wrapper.find(S3Image).prop("imgKey")).toBe(createsProduct.image[0].key);
    // expect the tags to be correct for the current product
    expect(wrapper.find(ChipContainer).prop("tags")).toStrictEqual([
      "Personalised",
      "Name",
      "Frame",
    ]);
  });
});
