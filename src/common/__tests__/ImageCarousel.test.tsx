import React from "react";
import * as amplify from "aws-amplify";
import { render, screen, fireEvent } from "@testing-library/react";
import { createsProduct, cakeProduct } from "../../__mocks__/products";
import ImageCarousel from "../containers/ImageCarousel";

describe("<ImageCarousel />", () => {
  const updateImageMock = jest.fn();
  beforeEach(() => {
    const storageSpy = jest.spyOn(amplify.Storage, "get");
    storageSpy.mockReturnValue(new Promise((res) => res));
  });
  describe("Snapshot tests", () => {
    it("should match snapshot correctly when product is cake", () => {
      const wrapper = render(
        <ImageCarousel
          images={cakeProduct.images.collection}
          type={cakeProduct.type}
          cover={cakeProduct.images.cover}
          handleUpdateImages={updateImageMock}
        />,
      );
      expect(wrapper).toMatchSnapshot();
    });

    it("should match the snapshot correctly when product is creation", () => {
      const wrapper = render(
        <ImageCarousel
          images={createsProduct.images.collection}
          type={createsProduct.type}
          cover={createsProduct.images.cover}
          handleUpdateImages={updateImageMock}
        />,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("UI testing", () => {
    it("should playback control buttons when there is more than 1 image", () => {
      const wrapper = render(
        <ImageCarousel
          images={cakeProduct.images.collection}
          type={cakeProduct.type}
          cover={cakeProduct.images.cover}
          handleUpdateImages={updateImageMock}
        />,
      );
      const slides = wrapper.getAllByRole("option");
      expect(slides.length).toBe(cakeProduct.images.collection.length);
      expect(wrapper.getByTestId("next-button")).toBeDefined();
      expect(wrapper.getByTestId("back-button")).toBeDefined();
    });
  });
});
