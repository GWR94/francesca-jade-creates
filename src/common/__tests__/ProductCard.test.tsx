import React from "react";
import { fireEvent, getByRole, render, screen, waitFor } from "@testing-library/react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import * as amplify from "aws-amplify";
import thunk from "redux-thunk";
import { CardHeader, StylesProvider } from "@material-ui/core";
import * as redux from "react-redux";
import ProductCard from "../containers/ProductCard";
import { cakeProduct, createsProduct } from "../../__mocks__/products";
import "@testing-library/jest-dom";
import { COLORS } from "../../themes";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("<ProductCard />", () => {
  beforeEach(() => {
    const selectSpy = jest.spyOn(redux, "useSelector");
    selectSpy.mockReturnValue({ user: "123" });
    const dispatchSpy = jest.spyOn(redux, "useDispatch");
    dispatchSpy.mockReturnValue((a) => a);
    const storageSpy = jest.spyOn(amplify.Storage, "get");
    storageSpy.mockReturnValue(new Promise((res) => res));
  });

  const generateClassName = (rule, styleSheet): string =>
    `${styleSheet.options.classNamePrefix}-${rule.key}`;

  describe("Cake Product", () => {
    it("should match snapshot correctly when user IS admin", () => {
      // create shallow wrapper
      const wrapper = render(
        <StylesProvider generateClassName={generateClassName}>
          <ProductCard product={cakeProduct} admin />
        </StylesProvider>,
      );
      // match snapshot
      expect(wrapper).toMatchSnapshot();
    });

    it("should render the correct colours for a Cake product", () => {
      const wrapper = render(
        <StylesProvider generateClassName={generateClassName}>
          <ProductCard product={cakeProduct} admin />
        </StylesProvider>,
      );
      expect(wrapper.getByTestId("card-container")).toHaveStyle({
        borderTop: `3px solid ${COLORS.LightPink}`,
      });
    });

    it("should match snapshot correctly when the user is NOT an admin'", () => {
      // create shallow wrapper
      const wrapper = render(
        <StylesProvider generateClassName={generateClassName}>
          <Provider
            store={mockStore({
              user: { admin: false },
              basket: {
                items: [],
              },
            })}
          >
            <ProductCard product={cakeProduct} />
          </Provider>
        </StylesProvider>,
      );
      // match snapshot
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.getByTitle("Racing Cake")).toBeDefined();
    });

    it("should open menu when clicking on menu-dots (as admin)", async () => {
      const wrapper = render(
        <StylesProvider generateClassName={generateClassName}>
          <Provider
            store={mockStore({
              user: { admin: true },
              basket: {
                items: [],
              },
            })}
          >
            <ProductCard product={cakeProduct} admin />
          </Provider>
        </StylesProvider>,
      );
      expect(wrapper).toMatchSnapshot();
      screen.getByTestId("menu-dots").click();
      expect(await screen.findByText("Edit Product")).toBeTruthy();
      expect(await screen.findByText("Delete Product")).toBeTruthy();
    });
  });

  describe("Creates product", () => {
    it("should render correctly when user IS admin", () => {
      // create shallow wrapper
      const wrapper = render(
        <StylesProvider generateClassName={generateClassName}>
          <Provider
            store={mockStore({
              user: { admin: true },
              basket: {
                items: [],
              },
            })}
          >
            <ProductCard product={createsProduct} admin />
          </Provider>
        </StylesProvider>,
      );
      // match snapshot
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.getByTestId("card-container")).toHaveStyle({
        borderTop: `3px solid ${COLORS.LightGray}`,
      });
      expect(wrapper.getByTitle("Wedding Day Frame")).toBeInTheDocument();
      expect(wrapper.getByTestId("menu-dots")).toBeInTheDocument();
    });

    it("should render the correct colours for the Creates product", () => {
      const wrapper = render(
        <StylesProvider generateClassName={generateClassName}>
          <Provider
            store={mockStore({
              user: { admin: true },
              basket: {
                items: [],
              },
            })}
          >
            <ProductCard product={createsProduct} admin />
          </Provider>
        </StylesProvider>,
      );
      expect(wrapper.getByTestId("card-container")).toHaveStyle({
        borderTop: `3px solid ${COLORS.LightGray}`,
      });
      expect(wrapper.getByTitle("Wedding Day Frame")).toBeInTheDocument();
    });

    it("should render correctly when the user is NOT admin", async () => {
      const wrapper = render(
        <StylesProvider generateClassName={generateClassName}>
          <Provider
            store={mockStore({
              user: { admin: false },
              basket: {
                items: [],
              },
            })}
          >
            <ProductCard product={createsProduct} />
          </Provider>
        </StylesProvider>,
      );
      // match snapshot
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.getByTitle("Wedding Day Frame")).toBeDefined();
      const menu = wrapper.getByTestId("menu-dots");
      fireEvent(menu, new MouseEvent("click"));
      wrapper.debug();

      await waitFor(() => expect(wrapper.getByText("Edit Product")).toBeInTheDocument());
    });

    it("should open menu when clicking on menu-dots (as admin)", async () => {
      const wrapper = render(
        <StylesProvider generateClassName={generateClassName}>
          <Provider
            store={mockStore({
              user: { admin: true },
              basket: {
                items: [],
              },
            })}
          >
            <ProductCard product={createsProduct} admin />
          </Provider>
        </StylesProvider>,
      );
      expect(wrapper).toMatchSnapshot();
      screen.getByTestId("menu-dots").click();

      expect(await screen.findByText("Edit Product")).toBeTruthy();
      expect(await screen.findByText("Delete Product")).toBeTruthy();
    });
  });
});
