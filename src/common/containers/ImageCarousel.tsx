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
import { makeStyles } from "@material-ui/core";
import { updateProduct } from "../../graphql/mutations";
import { openSnackbar } from "../../utils/Notifier";
import { ImageCarouselProps, ImageCarouselState } from "./interfaces/ImageCarousel.i";
import { COLORS, INTENT } from "../../themes";
import styles from "../styles/imageCarousel.style";
import DeleteImageDialog from "../alerts/DeleteImageDialog";

/**
 * TODO
 * [ ] Put tags inline in confirm dialog
 * [ ] Make sure all absolute positioned divs are below navbar
 * [x] Test deleting images without compressed version
 */

/**
 * Class component for displaying, updating and removing images for a specific product's
 * images. Images will be rendered inside a carousel component, and will have the option
 * to delete and save as cover photo by clicking on the relevant icons on the image.
 */
const ImageCarousel: React.FC<ImageCarouselProps> = ({
  type,
  images,
  update,
  id,
  isCentered,
  deleteImages,
  handleUpdateImages,
  cover,
}) => {
  const [state, setState] = useState<ImageCarouselState>({
    keyToDelete: "",
    isPlaying: true,
    imageLoading: true,
    coverImageIdx: cover,
  });

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isPlaying, setPlaying] = useState<boolean>(false);

  // Ref of carousel so event listeners can be mounted/unmounted to it.
  const carouselRef = React.useRef<HTMLDivElement | null>(null);

  // make the styles to be used in the component
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

  /**
   * Function to change the cover image of the current product (the image
   * that will be shown if only one image is allowed - i.e on a card or
   * as a thumbnail).
   * @param idx - the index of the image that the user wishes to make the
   * cover photo.
   */
  const handleCoverImageUpdate = async (idx: number): Promise<void> => {
    // set the cover image into state so the user knows that it's the cover photo
    setState({
      ...state,
      coverImageIdx: idx,
    });
    // execute the updateProduct mutation with the correct cover image
    const { data } = await API.graphql(
      graphqlOperation(updateProduct, {
        input: {
          id,
          images: {
            collection: images,
            cover: idx,
          },
        },
      }),
    );
    // if there's an error, notify the user
    if (!data)
      openSnackbar({ severity: "error", message: "Unable to update cover image" });
    // if there is data, notify the user of success.
    else
      openSnackbar({ severity: "success", message: "Successfully updated cover image." });
  };

  // create the styles by executing the useStyles function.
  const classes = useStyles();

  /**
   * When the component mounts an event listener should be added to the carousel
   * so it can be paused when hovering and play when removing the mouse from the
   * area - but only when there is 1 or more images in the array.
   */
  useEffect(() => {
    if (images.length > 1 && carouselRef.current) {
      carouselRef.current.addEventListener("mouseenter", (): void => {
        setPlaying(false);
      });
      carouselRef.current.addEventListener("mouseleave", (): void => {
        setPlaying(true);
      });
    }
    return (): void => {
      /**
       * Remove the event listeners when the component unmounts to prevent memory
       * leaks.
       */
      if (images.length > 1 && carouselRef.current) {
        carouselRef.current.removeEventListener("mouseenter", (): void => {
          setPlaying(false);
        });
        carouselRef.current.removeEventListener("mouseleave", (): void => {
          setPlaying(true);
        });
      }
    };
  }, []);

  /**
   * Method to remove an image from the carousel, which will inturn remove the
   * image from the database and sever the link between the image and the current
   * product.
   */
  const handleDeleteImage = async (keyToDelete: string): Promise<void> => {
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
      const arr = keyToDelete.split("/");
      const compressedKey = [arr[0], "/compressed-", ...arr.slice(1)].join("");
      await Storage.remove(compressedKey);

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
      setDialogOpen(false);
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
  const { keyToDelete, imageLoading, coverImageIdx } = state;
  return (
    <>
      <div className={isCentered ? classes.centeredImageContainer : ""}>
        {/* 
          If there is only one item in the images array, then there is no need to render
          the carousel component, so just place the image in a div.
        */}
        {images.length === 1 ? (
          <div style={{ position: "relative" }}>
            {deleteImages && (
              <>
                {/*
                  if the user is allowed to delete images (is an admin), show a pulsing
                  delete icon which shows the user that they can delete it
                 */}
                <i
                  className={`${classes.deleteIcon} fas fa-times animated infinite pulse`}
                  role="button"
                  tabIndex={0}
                  onClick={(): void => {
                    setState({
                      ...state,
                      keyToDelete: images[0].key,
                    });
                    setDialogOpen(true);
                  }}
                />
                {/*
                  If the user is an admin, show them that the current image is saved as
                  the cover image (as it's the only image for the product.) The star will
                  be filled.
                */}
                <i
                  className={`${classes.starIcon} fas fa-star animated infinite pulse`}
                  role="button"
                  tabIndex={0}
                />
              </>
            )}
            {/* Show the image to the user */}
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
            {/* Create the CarouselProvider with the correct inputs */}
            <CarouselProvider
              naturalSlideHeight={6}
              naturalSlideWidth={5}
              totalSlides={images.length}
              visibleSlides={1}
              step={1}
              isPlaying={isPlaying && !dialogOpen}
              infinite
            >
              {/* Render a slider component to hold the (soon to be) mapped Slides */}
              <Slider>
                {/* Map the images from props into a Slide component */}
                {images.map((image, i) => (
                  <Slide index={i} key={i} style={{ position: "relative" }}>
                    {deleteImages && (
                      <>
                        {/*
                          if the user is allowed to delete images (is an admin), show a pulsing
                          delete icon which shows the user that they can delete it
                        */}
                        <i
                          className={`${classes.deleteIcon} fas fa-times animated infinite pulse`}
                          role="button"
                          tabIndex={0}
                          onClick={(): void => {
                            setState({
                              ...state,
                              keyToDelete: image.key,
                            });
                            console.log(image.key);
                            setDialogOpen(true);
                          }}
                        />
                        {/*
                          If the user is an admin and the current index is the same as coverImageIdx
                          from state, then show the user a filled in star to notify the user that
                          it's the cover image. If it's not the same as coverImageIdx then show an
                          empty star.
                        */}
                        <i
                          className={`${classes.starIcon} ${
                            coverImageIdx === i ? "fas" : "far"
                          } fa-star animated infinite pulse`}
                          role="button"
                          tabIndex={0}
                          onClick={(): Promise<void> => handleCoverImageUpdate(i)}
                        />
                      </>
                    )}
                    {/* show the current image */}
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
      </div>
      {/* 
          Dialog to confirm if the user wants to delete the image. Only opens when
          the user clicks the delete icon on the image. 
       */}
      <DeleteImageDialog
        isOpen={dialogOpen}
        closeDialog={(): void => setDialogOpen(false)}
        keyToDelete={keyToDelete}
        handleDeleteImage={(key): Promise<void> => handleDeleteImage(key)}
      />
    </>
  );
};

export default ImageCarousel;
