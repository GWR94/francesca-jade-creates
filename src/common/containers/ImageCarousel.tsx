import React, { useEffect, useState } from "react";
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
import { createStyles, makeStyles, withStyles } from "@material-ui/core";
import { updateProduct } from "../../graphql/mutations";
import { openSnackbar } from "../../utils/Notifier";
import { ImageCarouselProps, ImageCarouselState } from "./interfaces/ImageCarousel.i";
import { COLORS, INTENT } from "../../themes";
import DeleteImageDialog from "../alerts/DeleteImageDialog";
import styles from "../styles/imageCarousel.style";

/**
 * Class component for displaying, updating and removing images for a specific product.
 */
const ImageCarousel: React.FC<ImageCarouselProps> = ({
  type,
  images,
  update,
  id,
  isCentered,
  deleteImages,
  handleUpdateImages,
}) => {
  const [state, setState] = useState<ImageCarouselState>({
    dialogOpen: false,
    keyToDelete: null,
    isPlaying: true,
  });

  // Ref of carousel so event listeners can be mounted/unmounted to it.
  const carouselRef = React.useRef<HTMLDivElement | null>(null);

  const useStyles = makeStyles({
    ...styles,
    backButton: {
      background: "none !important",
      border: "none",
      position: "absolute",
      top: "calc(50% - 30px)",
      height: 40,
      width: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      left: 5,
    },
    forwardButton: {
      background: "none !important",
      border: "none",
      position: "absolute",
      top: "calc(50% - 30px)",
      height: 40,
      width: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      right: 5,
    },
  });

  const classes = useStyles();

  /**
   * When the component mounts an event listener should be added to the carousel
   * so it can be paused when hovering and play when removing the mouse from the
   * area - but only when there is 1 or more images in the array.
   */
  useEffect(() => {
    if (images.length > 1 && carouselRef.current) {
      carouselRef.current.addEventListener("mouseenter", (): void => {
        setState({ ...state, isPlaying: false });
      });
      carouselRef.current.addEventListener("mouseleave", (): void => {
        setState({ ...state, isPlaying: true });
      });
    }
    return (): void => {
      /**
       * Remove the event listeners when the component unmounts to prevent memory
       * leaks.
       */
      if (images.length > 1 && carouselRef.current) {
        carouselRef.current.removeEventListener("mouseenter", (): void => {
          setState({ ...state, isPlaying: false });
        });
        carouselRef.current.removeEventListener("mouseleave", (): void => {
          setState({ ...state, isPlaying: true });
        });
      }
    };
  }, []);

  /**
   * Method to remove an image from the carousel, which will inturn remove the
   * image from the database and sever the link between the image and the current
   * product.
   */
  const handleDeleteImage = async (): Promise<void> => {
    // destructure the key to delete!bet wi
    const { keyToDelete } = state;
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
          graphqlOperation(updateProduct, {
            input: { id, images: { cover: 0, collection: updatedImages } },
          }),
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
      setState({ ...state, dialogOpen: false });
    } catch (err) {
      /**
       * If there are any errors at any point in the function, notify the user with a
       * danger snackbar with a relevant message.
       */
      console.error(err);
      openSnackbar({
        severity: "error",
        message: "Failed to removed image. Please try again.",
      });
    }
  };

  const { dialogOpen, keyToDelete, isPlaying } = state;
  return (
    // @ts-expect-error
    <div style={isCentered ? classes.centeredImageContainer : {}}>
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
              className={`${classes.deleteIcon} fas fa-times animated infinite pulse`}
              role="button"
              tabIndex={0}
              onClick={(): void => {
                setState({
                  ...state,
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
        <div ref={carouselRef} style={{ position: "relative" }}>
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
                      className={`${classes.deleteIcon} fas fa-times animated infinite pulse`}
                      role="button"
                      tabIndex={0}
                      onClick={(): void => {
                        setState({
                          ...state,
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
            <ButtonBack className={`${classes.backButton} animated pulse infinite`}>
              <ChevronLeft
                className={classes.svg}
                style={{ color: type === "Cake" ? COLORS.Pink : COLORS.Purple }}
              />
            </ButtonBack>
            <ButtonNext className={`${classes.forwardButton} animated pulse infinite`}>
              <ChevronRight
                className={classes.svg}
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
          closeDialog={(): void => setState({ ...state, dialogOpen: false })}
          keyToDelete={keyToDelete}
          handleDeleteImage={handleDeleteImage}
        />
      )}
    </div>
  );
};

export default ImageCarousel;
