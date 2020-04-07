import React from "react";
import { shallow } from "enzyme";
import { Carousel, CarouselIndicators, CarouselControl } from "reactstrap";
import { S3Image } from "aws-amplify-react";
import ImageCarousel from "../ImageCarousel";

describe("<ImageCarousel />", () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, "useState");
  // @ts-ignore
  useStateSpy.mockImplementation((init) => [init, setState]);

  afterEach(() => {
    jest.clearAllMocks();
  });

  const multipleImages = [
    {
      bucket: "fjadecreatesmedia121747-production",
      region: "eu-west-2",
      key:
        "/public/eu-west-2:1f7a6231-22c8-459a-a078-69ef91991a5e/1584106241635-IMG_0299.JPEG",
    },
    {
      bucket: "fjadecreatesmedia121747-production",
      region: "eu-west-2",
      key:
        "/public/eu-west-2:1f7a6231-22c8-459a-a078-69ef91991a5e/1584106247322-IMG_0088.JPG",
    },
  ];

  const images = [
    {
      bucket: "fjadecreatesmedia121747-production",
      region: "eu-west-2",
      key:
        "/public/eu-west-2:1f7a6231-22c8-459a-a078-69ef91991a5e/1584106241635-IMG_0299.JPEG",
    },
  ];

  it("should render correctly when only one image is in image array prop", () => {
    const wrapper = shallow(<ImageCarousel id="test123" images={images} />);
    expect(wrapper).toMatchSnapshot();
    // checks the result is the image container rather than carousel
    expect(
      wrapper.find(".carousel__container").at(0).childAt(0).prop("className"),
    ).toEqual("update__image-container");
    // check the child is of type S3Image rather than carousel item.
    expect(wrapper.find(".update__image-container").at(0).childAt(0).type()).toBe(
      S3Image,
    );
  });

  it("should render correctly when multiple images in image array prop", () => {
    const wrapper = shallow(<ImageCarousel id="test321" images={multipleImages} />);
    expect(wrapper).toMatchSnapshot();
    const carousel = wrapper.find(".carousel__container").at(0).childAt(0);
    expect(carousel.type()).toBe(Carousel);
    expect(carousel.childAt(0).type()).toBe(CarouselIndicators);
    const image = wrapper.find(".update__image-container").at(0).childAt(0);
    expect(image.type()).toEqual(S3Image);
    expect(image.prop("imgKey")).toBe(multipleImages[0].key);
  });

  it("should change currentIndex state which controls what image is shown when clicking on the next carousel button", () => {
    const wrapper = shallow(<ImageCarousel id="test123" images={multipleImages} />);
    const image = wrapper.find(".update__image-container").at(0).childAt(0);
    expect(image.type()).toBe(S3Image);
    // check initial state
    expect(wrapper.find(Carousel).prop("activeIndex")).toBe(0);
    expect(wrapper.state("currentIndex")).toBe(0);
    // click next control button
    wrapper.find(CarouselControl).at(1).props().onClickHandler();
    expect(wrapper.state("currentIndex")).toBe(1);
    expect(wrapper.find(Carousel).at(0).prop("activeIndex")).toBe(1);
    // click next to wrap round to start of the images (0)
    wrapper.find(CarouselControl).at(1).props().onClickHandler();
    expect(wrapper.state("currentIndex")).toBe(0);
    expect(wrapper.find(Carousel).at(0).prop("activeIndex")).toBe(0);
  });

  it("should change currentIndex state which controls what image is shown when clicking prev carousel button", () => {
    const wrapper = shallow(<ImageCarousel id="123test" images={multipleImages} />);
    expect(wrapper.state("currentIndex")).toBe(0);
    // go to the next image
    wrapper.find(CarouselControl).at(1).props().onClickHandler();
    expect(wrapper.state("currentIndex")).toBe(1);
    expect(wrapper.find(Carousel).at(0).prop("activeIndex")).toBe(1);
    // go to previous
    wrapper.find(CarouselControl).at(0).props().onClickHandler();
    expect(wrapper.state("currentIndex")).toBe(0);
    expect(wrapper.find(Carousel).at(0).prop("activeIndex")).toBe(0);
    // previous goes to last image in array (1)
    wrapper.find(CarouselControl).at(0).props().onClickHandler();
    expect(wrapper.state("currentIndex")).toBe(1);
    expect(wrapper.find(Carousel).at(0).prop("activeIndex")).toBe(1);
  });
});
