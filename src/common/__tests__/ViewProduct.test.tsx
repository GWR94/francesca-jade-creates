/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState as useStateMock } from "react";
import { shallow } from "enzyme";
import ConnectedViewProduct, { ViewProduct } from "../product/ViewProduct";
import Loading from "../Loading";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

describe("<ViewProduct />", () => {
  it("should render the loading component when there is no product", () => {
    const wrapper = shallow<ViewProduct>(
      <ViewProduct id="123" userAttributes={{ username: "123" }} />,
    );
    wrapper.instance().getProducts = jest.fn();
    expect(wrapper.find(Loading).length).toBe(1);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render correctly when injecting product into state", () => {
    const setState = jest.fn();
    beforeEach(() => {
      // @ts-ignore
      useStateMock.mockImplementation((init) => [init, setState]);
    });

    const wrapper = shallow<ViewProduct>(
      <ViewProduct id="123" userAttributes={{ username: "123" }} />,
    );
    expect(wrapper).toMatchSnapshot();
    wrapper.instance().getProducts = jest.fn();
    expect(wrapper.instance().getProducts).toHaveBeenCalledTimes(1);
  });
});
