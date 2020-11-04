import { Typography } from "@material-ui/core";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { S3Image } from "aws-amplify-react";
import React from "react";
import { S3ImageProps } from "../../accounts/interfaces/Product.i";

interface UploadedImagesProps {
  images: S3ImageProps[];
}

/**
 * Component which shows the current images uploaded by the user in a
 * Splide Slide component.
 * @param images - Array of S3ImageProps containing s3 data which will
 * be used to render a Splide carousel of these images.
 */
const UploadedImages: React.FC<UploadedImagesProps> = ({ images }): JSX.Element => {
  return (
    <>
      <Typography variant="subtitle2" gutterBottom style={{ marginTop: 10 }}>
        Uploaded Images:
      </Typography>
      {/* create the Splide container for the images */}
      <Splide
        options={{
          width: 220,
          // show navigation arrows on the splide carousel if there's more than 1 image
          arrows: images.length > 1,
        }}
      >
        {/* map the images into a SplideSlide */}
        {images.map((file: S3ImageProps, i: number) => {
          return (
            <SplideSlide key={i} style={{ width: "100%" }}>
              <S3Image
                imgKey={file.key}
                theme={{
                  photoImg: {
                    width: 220,
                  },
                }}
              />
            </SplideSlide>
          );
        })}
      </Splide>
    </>
  );
};

export default UploadedImages;
