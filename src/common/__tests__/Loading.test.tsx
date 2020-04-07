import React from "react";
import { Spinner } from "@blueprintjs/core";
import { shallow } from "enzyme";
import Loading from "../Loading";

describe("<Loading />", () => {
  it("should render correctly with no props", () => {
    const loading = shallow(<Loading />);
    expect(loading).toMatchSnapshot();
    expect(loading.find("div.loading__container").length).toBe(1);
    expect(loading.find(Spinner).length).toBe(1);
    expect(loading.find(Spinner).prop("size")).toBe(100);
    expect(loading.find(Spinner).prop("className")).toBe("loading__spinner");
  });

  it("should render smaller spinner based on size prop being 10", () => {
    const loadingSmall = shallow(<Loading size={10} />);
    expect(loadingSmall.find("div.loading__container").length).toBe(1);
    expect(loadingSmall.find(Spinner).length).toBe(1);
    expect(loadingSmall.find(Spinner).prop("size")).toBe(10);
    expect(loadingSmall.find(Spinner).prop("className")).toBe("loading__spinner");
  });

  it("should render larger spinner based on size prop being 200", () => {
    const loadingLarge = shallow(<Loading size={200} />);
    expect(loadingLarge.find("div.loading__container").length).toBe(1);
    expect(loadingLarge.find(Spinner).length).toBe(1);
    expect(loadingLarge.find(Spinner).prop("size")).toBe(200);
    expect(loadingLarge.find(Spinner).prop("className")).toBe("loading__spinner");
  });
});
