import React from "react";
import { shallow } from "enzyme";
import ProductTypePage from "../product/ProductTypePage";
import { history } from "../../routes/Router";
import { createsProduct, cakeProduct } from "../../__mocks__/products";
import ProductsList from "../ProductsList";
import Loading from "../Loading";

describe("<ProductTypePage />", () => {
  it("should render the loading page before fetching products in handleGetProducts", () => {
    const wrapper = shallow(<ProductTypePage history={history} type="Cake" />);
    expect(wrapper.find(Loading).length).toBe(1);
    expect(wrapper.find(Loading).prop("size")).toBe(100);
  });

  it("should render correctly when rendering type 'Cake'", () => {
    const wrapper = shallow<ProductTypePage>(
      <ProductTypePage history={history} type="Cake" />,
    );
    wrapper.instance().handleGetProducts = jest.fn();
    wrapper.update();
    wrapper.instance().handleGetProducts();
    expect(wrapper.instance().handleGetProducts).toHaveBeenCalledTimes(1);
    wrapper.setState({
      isLoading: false,
      products: [cakeProduct],
    });
    expect(wrapper.find("h3.product-type__title").text()).toBe("Cakes");
    expect(wrapper.find("p.product-type__filter").text()).toBe(
      "To filter the products please click the pink button on the left hand side, and filter the results to your preferences.",
    );
    expect(wrapper.find(ProductsList).prop("products")).toStrictEqual([cakeProduct]);
    expect(wrapper.find(ProductsList).prop("type")).toBe("Cake");
    expect(wrapper).toMatchSnapshot();
  });

  it("should render correctly when rendering type 'Creates'", () => {
    const wrapper = shallow<ProductTypePage>(
      <ProductTypePage history={history} type="Creates" />,
    );
    wrapper.instance().handleGetProducts = jest.fn();
    wrapper.update();
    wrapper.instance().handleGetProducts();
    expect(wrapper.instance().handleGetProducts).toHaveBeenCalledTimes(1);
    wrapper.setState({
      isLoading: false,
      products: [createsProduct],
    });
    expect(wrapper.find("h3.product-type__title").text()).toBe("Creations");
    expect(wrapper.find("p.product-type__filter").text()).toBe(
      "To filter the products please click the pink button on the left hand side, and filter the results to your preferences.",
    );
    expect(wrapper.find(ProductsList).prop("products")).toStrictEqual([createsProduct]);
    expect(wrapper.find(ProductsList).prop("type")).toBe("Creates");
    expect(wrapper).toMatchSnapshot();
  });
});
