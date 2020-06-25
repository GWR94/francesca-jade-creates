import React from "react";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { S3Image } from "aws-amplify-react";
import { API, Storage, graphqlOperation } from "aws-amplify";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import { updateProduct } from "../../graphql/mutations";
import { openSnackbar } from "../../utils/Notifier";
import { ImageCarouselProps, ImageCarouselState } from "./interfaces/ImageCarousel.i";
import { COLORS, INTENT } from "../../themes";
import DeleteImageDialog from "../alerts/DeleteImageDialog";

/**
 * Class component for displaying, updating and removing images for a specific product.
 */
class ImageCarousel extends React.Component<ImageCarouselProps, ImageCarouselState> {
  public readonly state: ImageCarouselState = {
    dialogOpen: false,
    keyToDelete: null,
    isPlaying: true,
  };

  // Ref of carousel so event listeners can be mounted/unmounted to it.
  public carouselRef = React.createRef<HTMLDivElement>();

  /**
   * When the component mounts an event listener should be added to the carousel
   * so it can be paused when hovering and play when removing the mouse from the
   * area - but only when there is 1 or more images in the array.
   */
  public componentDidMount(): void {
    const { images } = this.props;
    if (images.length > 1 && this.carouselRef.current) {
      this.carouselRef.current.addEventListener("mouseenter", (): void => {
        this.setState({ isPlaying: false });
      });
      this.carouselRef.current.addEventListener("mouseleave", (): void => {
        this.setState({ isPlaying: true });
      });
    }
  }

  /**
   * Remove the event listeners when the component unmounts to prevent memory
   * leaks.
   */
  public componentWillUnmount(): void {
    const { images } = this.props;
    if (images.length > 1 && this.carouselRef.current) {
      this.carouselRef.current.removeEventListener("mouseenter", (): void => {
        this.setState({ isPlaying: false });
      });
      this.carouselRef.current.removeEventListener("mouseleave", (): void => {
        this.setState({ isPlaying: true });
      });
    }
  }

  /**
   * Method to remove an image from the carousel, which will inturn remove the
   * image from the database and sever the link between the image and the current
   * product.
   */
  public handleDeleteImage = async (): Promise<void> => {
    // destructure the key to delete!bet wi
    const { keyToDelete } = this.state;
    const { images, update, id, handleUpdateImages } = this.props;
    /**
     * if there is no value in keyToDelete, then the operation cannot be completed,
     * so notify the user of this with a danger snackbar, and return from the function.
     */
    if (!keyToDelete) {
      openSnackbar({
        severity: INTENT.Danger,
        message: "Invalid key to delete. Please try again.",
      });
      return;
    }
    try {
      /**
       * filter out the key (which is saved in state from clicking the remove button
       * on the image in the carousel), so that it's been removed from the array, and
       * therefore updated to its correct data in state.
       */
      const updatedImages = images.filter((img) => img.key !== keyToDelete);
      /**
       * remove the image from the database by providing the key to delete to
       * aws-amplify Storage library
       */
      await Storage.remove(keyToDelete);

      /**
       * If the update prop is set to true, then the link from the image to the product
       * has to be severed, which can be done using the updateProduct graphQL mutation.
       * The previously created updatedImages needs to be passed for the image property
       * so the images left are the correct ones.
       */
      if (update) {
        await API.graphql(
          graphqlOperation(updateProduct, { input: { id, image: updatedImages } }),
        );
      }
      /**
       * Once the operation is complete, let the user know with a success snackbar with
       * a relevant message.
       */
      openSnackbar({
        severity: "success",
        message: "Successfully removed image.",
      });
      // if the handleUpdateImages function is defined, execute it.
      if (handleUpdateImages) handleUpdateImages(updatedImages);
      this.setState({ dialogOpen: false });
    } catch (err) {
      /**
       * If there are any errors at any point in the function, notify the user with a
       * danger snackbar with a relevant message.
       */
      openSnackbar({
        severity: "error",
        message: "Failed to removed image. Please try again.",
      });
    }
  };

  public render(): JSX.Element {
    const { images, deleteImages, type } = this.props;
    const { dialogOpen, keyToDelete, isPlaying } = this.state;
    return (
      <>
        {/* 
          If there is only one item in the images array, then there is no need to render
          the carousel component, so just place the image in a div.
        */}
        {images.length === 1 ? (
          <div style={{ position: "relative" }}>
            {deleteImages && (
              /**
               * if the user is allowed to delete images (is an admin), show a pulsing
               * delete icon which shows the user that they can delete it
               */
              <i
                className="fas fa-times carousel__delete-icon animated infinite pulse"
                role="button"
                tabIndex={0}
                onClick={(): void => {
                  this.setState({
                    dialogOpen: true,
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
          /**
           * If there is more than one image in the array then the carousel needs to be
           * rendered with each of the images mapped to a Slide component.
           */
          <div ref={this.carouselRef} style={{ position: "relative" }}>
            <CarouselProvider
              naturalSlideHeight={6}
              naturalSlideWidth={5}
              totalSlides={images.length}
              visibleSlides={1}
              step={1}
              isPlaying={isPlaying && !dialogOpen}
              infinite
            >
              <Slider>
                {images.map((image, i) => (
                  <Slide index={i} key={i} style={{ position: "relative" }}>
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
                    <S3Image
                      imgKey={image.key}
                      theme={{
                        photoImg: {
                          width: "100%",
                        },
                      }}
                    />
                  </Slide>
                ))}
              </Slider>
              {/*  Buttons to control the playback of the carousel */}
              <ButtonBack className="carousel__back animated pulse infinite">
                <ChevronLeft
                  className="carousel__svg"
                  style={{ color: type === "Cake" ? COLORS.Pink : COLORS.Purple }}
                />
              </ButtonBack>
              <ButtonNext className="carousel__forward animated pulse infinite">
                <ChevronRight
                  className="carousel__svg"
                  style={{ color: type === "Cake" ? COLORS.Pink : COLORS.Purple }}
                />
              </ButtonNext>
            </CarouselProvider>
          </div>
        )}
        {/* 
          Dialog to confirm if the user wants to delete the image. Only opens when
          the user clicks the delete icon on the image. 
        */}
        {keyToDelete && (
          <DeleteImageDialog
            dialogOpen={dialogOpen}
            closeDialog={(): void => this.setState({ dialogOpen: false })}
            keyToDelete={keyToDelete}
            handleDeleteImage={this.handleDeleteImage}
          />
        )}
      </>
    );
  }
}

export default ImageCarousel;
