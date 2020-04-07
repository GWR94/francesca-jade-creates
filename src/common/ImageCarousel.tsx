import React from "react";
import { Carousel, CarouselIndicators, CarouselItem, CarouselControl } from "reactstrap";
import { S3Image } from "aws-amplify-react";
import { API, Storage, graphqlOperation } from "aws-amplify";
import { Button, Dialog } from "@blueprintjs/core";
import { S3ImageProps } from "./interfaces/Product.i";
import { updateProduct } from "../graphql/mutations";
import { Toaster } from "../utils";

interface Props {
  images: S3ImageProps[];
  deleteImages?: boolean;
  id?: string;
  handleUpdateImages?: (image: S3ImageProps[]) => void;
  update?: boolean;
}

interface State {
  animating: boolean;
  currentIndex: number;
  dialogOpen: boolean;
  keyToDelete: string;
}

class ImageCarousel extends React.Component<Props, State> {
  public readonly state: State = {
    animating: false,
    currentIndex: 0,
    dialogOpen: false,
    keyToDelete: null,
  };

  public handleNextImage = (): void => {
    const { animating, currentIndex } = this.state;
    const { images } = this.props;
    if (animating) return;
    this.setState({
      currentIndex: currentIndex === images.length - 1 ? 0 : currentIndex + 1,
    });
  };

  public handlePreviousImage = (): void => {
    const { animating, currentIndex } = this.state;
    const { images } = this.props;
    if (animating) return;
    this.setState({
      currentIndex: currentIndex === 0 ? images.length - 1 : currentIndex - 1,
    });
  };

  public goToIndex = (idx: number): void => {
    const { animating } = this.state;
    if (animating) return;
    this.setState({ currentIndex: idx });
  };

  public handleDeleteImage = async (): Promise<void> => {
    const { keyToDelete } = this.state;
    const { images, update, id, handleUpdateImages } = this.props;
    try {
      const updatedImages = images.filter((img) => img.key !== keyToDelete);
      this.setState({ currentIndex: 0 });
      await Storage.remove(keyToDelete);
      if (update) {
        await API.graphql(
          graphqlOperation(updateProduct, { input: { id, image: updatedImages } }),
        );
      }
      Toaster.show({
        intent: "success",
        message: "Successfully removed image.",
      });
      handleUpdateImages(updatedImages);
      // setDialogOpen(false);
      this.setState({ animating: false });
    } catch (err) {
      console.error(err);
      Toaster.show({
        intent: "danger",
        message: "Failed to removed image. Please try again.",
      });
    }
  };

  public render(): JSX.Element {
    const { images, deleteImages } = this.props;
    const { currentIndex, dialogOpen, keyToDelete } = this.state;
    return (
      <>
        <div className="carousel__container">
          {images.length === 1 ? (
            <div className="update__image-container">
              {deleteImages && (
                <i
                  className="fas fa-times carousel__delete-icon animated infinite pulse"
                  role="button"
                  tabIndex={0}
                  onClick={(): void => {
                    this.setState({
                      dialogOpen: false,
                      keyToDelete: images[0].key,
                    });
                  }}
                />
              )}
              <S3Image
                imgKey={images[0].key}
                theme={{
                  photoImg: {
                    width: "100%",
                  },
                }}
              />
            </div>
          ) : (
            <Carousel
              activeIndex={currentIndex}
              next={this.handleNextImage}
              previous={this.handlePreviousImage}
            >
              <CarouselIndicators
                items={images}
                activeIndex={currentIndex}
                onClickHandler={(idx): void => this.setState({ currentIndex: idx })}
                className="carousel__indicators"
              />
              {images.map((image, i) => (
                <CarouselItem
                  onExiting={(): void => this.setState({ animating: true })}
                  onExited={(): void => this.setState({ animating: false })}
                  key={i}
                >
                  {deleteImages && (
                    <i
                      className="fas fa-times carousel__delete-icon animated infinite pulse"
                      role="button"
                      tabIndex={0}
                      onClick={(): void => {
                        this.setState({
                          dialogOpen: true,
                          keyToDelete: image.key,
                        });
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
                onClickHandler={this.handlePreviousImage}
              />
              <CarouselControl
                direction="next"
                directionText="Next"
                onClickHandler={this.handleNextImage}
              />
            </Carousel>
          )}
        </div>
        <Dialog
          isOpen={dialogOpen}
          icon="trash"
          onClose={(): void => this.setState({ dialogOpen: false })}
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
                onClick={(): void => this.setState({ dialogOpen: false })}
                style={{ margin: "0 5px" }}
              />
              <Button
                intent="success"
                text="Confirm"
                onClick={this.handleDeleteImage}
                style={{ margin: "0 5px" }}
              />
            </div>
          </div>
        </Dialog>
      </>
    );
  }
}

export default ImageCarousel;
