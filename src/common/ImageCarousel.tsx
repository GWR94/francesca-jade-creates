import React, { useState } from "react";
import { Carousel, CarouselIndicators, CarouselItem, CarouselControl } from "reactstrap";
import { S3Image } from "aws-amplify-react";
import { API, Storage, graphqlOperation } from "aws-amplify";
import { Button, Dialog } from "@blueprintjs/core";
import { S3ImageProps } from "./interfaces/Product.i";
import { updateProduct } from "../graphql/mutations";
import { Toaster } from "../utils";

interface Props {
  images?: S3ImageProps[];
  deleteImages?: boolean;
  id?: string;
  handleUpdateImages?: (image: S3ImageProps[]) => void;
}

const ImageCarousel: React.FC<Props> = ({
  id,
  images,
  deleteImages = false,
  handleUpdateImages,
}) => {
  const [animating, setAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState(null);

  const handleNextImage = (): void => {
    if (animating) return;
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const handlePreviousImage = (): void => {
    if (animating) return;
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToIndex = (idx: number): void => {
    if (animating) return;
    setCurrentIndex(idx);
  };

  const handleDeleteImage = async (): Promise<void> => {
    try {
      const updatedImages = images.filter((img) => img.key !== keyToDelete);
      setCurrentIndex(0);
      await Storage.remove(keyToDelete);
      await API.graphql(
        graphqlOperation(updateProduct, { input: { id, image: updatedImages } }),
      );
      Toaster.show({
        intent: "success",
        message: "Successfully removed image.",
      });
      handleUpdateImages(updatedImages);
      setDialogOpen(false);
      setAnimating(false);
    } catch (err) {
      console.error(err);
      Toaster.show({
        intent: "danger",
        message: "Failed to removed image. Please try again.",
      });
    }
  };

  return (
    <>
      <div className="carousel__container">
        <Carousel
          activeIndex={currentIndex}
          next={handleNextImage}
          previous={handlePreviousImage}
        >
          <CarouselIndicators
            items={images}
            activeIndex={currentIndex}
            onClickHandler={(idx): void => goToIndex(idx)}
            className="carousel__indicators"
          />
          {images.map((image, i) => (
            <CarouselItem
              onExiting={(): void => setAnimating(true)}
              onExited={(): void => setAnimating(false)}
              key={i}
            >
              {deleteImages && (
                <i
                  className="fas fa-times carousel__delete-icon animated infinite pulse"
                  role="button"
                  tabIndex={0}
                  onClick={(): void => {
                    setDialogOpen(true);
                    setKeyToDelete(image.key);
                  }}
                />
              )}
              <div className="update__image-container">
                <S3Image
                  imgKey={image.key}
                  theme={{
                    photoImg: {
                      width: "100%",
                    },
                  }}
                />
              </div>
            </CarouselItem>
          ))}
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={handlePreviousImage}
          />
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={handleNextImage}
          />
        </Carousel>
      </div>
      <Dialog
        isOpen={dialogOpen}
        icon="trash"
        onClose={(): void => setDialogOpen(false)}
        title="Are you sure?"
      >
        <div className="update__alert-container">
          <p className="text-center">Are you sure you want to delete this image?</p>
          <p className="text-center">Other images can be added at a later date.</p>

          <S3Image
            imgKey={keyToDelete}
            theme={{
              photoImg: { maxWidth: "100%", marginBottom: "20px" },
            }}
          />
          <div className="dialog__button-container">
            <Button
              intent="danger"
              text="Cancel"
              onClick={(): void => setDialogOpen(false)}
              style={{ margin: "0 5px" }}
            />
            <Button
              intent="success"
              text="Confirm"
              onClick={handleDeleteImage}
              style={{ margin: "0 5px" }}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ImageCarousel;
