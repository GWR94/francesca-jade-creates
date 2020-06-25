import React from "react";
import { shallow } from "enzyme";
import { S3Image, PhotoPicker } from "aws-amplify-react";
import { FormGroup } from "@blueprintjs/core";
import ImagePicker from "../containers/ImagePicker";

describe("<ImagePicker />", () => {
  const setImageFn = jest.fn();
  it("should render correctly with savedS3Image prop", () => {
    const wrapper = shallow(
      <ImagePicker
        setImageFile={setImageFn}
        savedS3Image={{
          bucket: "fjadecreatesmedia121747-production",
          region: "eu-west-2",
          key:
            "/public/eu-west-2:1f7a6231-22c8-459a-a078-69ef91991a5e/1584106241635-IMG_0299.JPEG",
        }}
      />,
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(S3Image).length).toBe(1);
    expect(wrapper.find(S3Image).prop("imgKey")).toEqual(
      "/public/eu-west-2:1f7a6231-22c8-459a-a078-69ef91991a5e/1584106241635-IMG_0299.JPEG",
    );
    expect(wrapper.find(PhotoPicker).length).toEqual(1);
  });

  it("should render correctly with no savedS3Image prop", () => {
    const wrapper = shallow(<ImagePicker setImageFile={setImageFn} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(S3Image).length).toBe(0);
  });

  it("should render text when the showText prop is true", () => {
    const wrapper = shallow(<ImagePicker showText setImageFile={setImageFn} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(FormGroup).prop("label")).toBe("Display Image:");
    expect(wrapper.find(FormGroup).prop("labelInfo")).toBe("(optional)");
  });
});
