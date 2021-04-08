import React from "react";
import {
  FormLabel,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  withStyles,
} from "@material-ui/core";
import { S3Image, PhotoPicker } from "aws-amplify-react";
import ReactCrop, { Crop } from "react-image-crop";
import { ImagePickerProps, ImagePickerState } from "./interfaces/ImagePicker.i";
import "react-image-crop/dist/ReactCrop.css";
import { openSnackbar } from "../../utils/Notifier";
import { COLORS, INTENT } from "../../themes";
import styles from "../styles/imagePicker.style";

const initialState: ImagePickerState = {
  imagePreview: null,
  src: null,
  crop: {
    unit: "%",
    width: 50,
    height: 50,
    aspect: 4 / 5,
  },
  croppedImage: null,
  cropperOpen: false,
  originalFileName: "",
};

/**
 * Image Picker class which allows the user to pick an image from their system, and
 * upload it to S3, which will then be shown in either the ImageCarousel component, or
 * be their profile image in Profile
 */
class ImagePicker extends React.Component<ImagePickerProps, ImagePickerState> {
  public readonly state = initialState;

  public imageRef: HTMLImageElement | undefined;

  /**
   * Set the image to be the imageRef when it first loads
   * @param {HTMLImageElement} image
   */
  public onImageLoaded = (image: HTMLImageElement): void => {
    this.imageRef = image;
  };

  /**
   * Function to run when the cropping is completed by the user
   * @param {Crop} crop - The dimensions of the cropped image
   */
  public onCropComplete = (crop: Crop): void => {
    this.makeClientCrop(crop);
  };

  /**
   * Save the dimensions of the cropped image to state when they are changed by the user
   * @param {Crop} crop - the dimensions of the cropped image
   */
  public onCropChange = (crop: Crop): void => this.setState({ crop });

  /**
   * Creates a file from the dimensions of crop which were created by the user initiating image cropping.
   * @param {Crop} crop - the dimensions of the desired area.
   */
  public makeClientCrop = async (crop: Crop): Promise<void> => {
    const { originalFileName } = this.state;
    if (this.imageRef && crop.width && crop.height) {
      // get the blob data
      const croppedImage: Blob = await this.getCroppedImg(
        this.imageRef,
        crop,
        originalFileName,
      );
      // convert to file to be saved to S3
      const file = new File([croppedImage], originalFileName, {
        type: croppedImage.type,
        lastModified: Date.now(),
      });
      // set the cropped image file to the state so it can be saved to S3 when creating the product.
      this.setState({ croppedImage: file });
    }
  };

  /**
   * Get cropped image from the cropping library, and return it.
   * @param {HTMLImageElement} Image - the original "pre-cropped" image.
   * @param {Crop} crop - The dimensions of the cropped image
   * @param {string} fileName - The name which the cropped image will be given once saved.
   */
  public getCroppedImg = async (
    image: HTMLImageElement,
    crop: Crop,
    fileName: string,
  ): Promise<Blob> => {
    // create the canvas to place the cropped image in
    const canvas = document.createElement("canvas");
    // set the scale for the image
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    // set the dimensions for the image
    if (canvas.width && crop.width && canvas.height && crop.height) {
      canvas.width = crop.width;
      canvas.height = crop.height;
    }
    const ctx = canvas.getContext("2d");
    // draw the cropped image onto the canvas
    if (ctx && crop.x && scaleX && crop.y && scaleY && crop.width && crop.height) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
      );
    }
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob: Blob | null) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          console.error("Canvas is empty");
          return;
        }
        Object.defineProperty(blob, "name", {
          writable: true,
          value: fileName,
        });
        resolve(blob);
      }, "image/jpeg");
    });
  };

  public render(): JSX.Element {
    const {
      savedS3Image,
      disabled = false,
      setImageFile,
      savedImage,
      // theme,
      setImagePreview,
      // showPreview,
      update,
      profile,
      showText,
      cropImage,
      type,
      classes,
    } = this.props;
    const { imagePreview, src, crop, cropperOpen, croppedImage } = this.state;

    return (
      <>
        <FormLabel className={classes.input}>{showText && "Display Image:"}</FormLabel>
        {/* Show image preview if one exists */}
        {imagePreview ? (
          <div className={classes.imageContainer}>
            <img className={classes.image} src={imagePreview} alt="Image Preview" />
          </div>
        ) : savedS3Image ? (
          // Show saved S3 image if passed through via props
          <div className={classes.imageContainer}>
            <S3Image
              imgKey={savedS3Image.key}
              theme={{
                photoImg: { maxWidth: "100%" },
              }}
            />
          </div>
        ) : (
          profile && (
            <div className={classes.imageContainer}>
              <img src={savedImage} alt="Profile" className={classes.image} />
            </div>
          )
        )}
        {/* only show PhotoPicker if the disabled prop is not true/defined */}
        {!disabled && (
          <PhotoPicker
            title={update ? "Add another image" : "Select an image"}
            preview="hidden"
            headerHint="This can be changed anytime."
            headerText="Add a display image"
            onLoad={(url): void => {
              // if there is no need to crop the image, then set url to imagePreview to show preview in component
              if (!cropImage) {
                return this.setState({ imagePreview: url });
              }
              // set src to url, so it can be used for cropping, and open the crop dialog by setting cropperOpen.
              this.setState({ src: url, cropperOpen: true });
              setImagePreview && setImagePreview(url);
            }}
            onPick={(file): void => {
              this.setState({ originalFileName: file.name });
              !cropImage && setImageFile(file);
            }}
            theme={{
              ...styles,
              photoPickerButton: {
                ...styles.photoPickerButton,
                background: type === "Cake" ? COLORS.Pink : COLORS.Gray,
              },
            }}
          />
        )}
        <Dialog open={cropperOpen}>
          <DialogTitle>Crop your image</DialogTitle>
          {src && (
            <>
              <ReactCrop
                src={src}
                crop={crop}
                ruleOfThirds
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onCropComplete}
                onChange={this.onCropChange}
              />
            </>
          )}
          <DialogActions>
            <Button
              color="secondary"
              onClick={(): void => this.setState({ cropperOpen: false })}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={(): void => {
                try {
                  if (croppedImage) {
                    setImageFile(croppedImage);
                  }
                } catch (err) {
                  openSnackbar({
                    severity: INTENT.Danger,
                    message: "Unable to parse image, please try again.",
                  });
                }
                this.setState({ ...initialState });
              }}
            >
              Add Image
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default withStyles(styles)(ImagePicker);
