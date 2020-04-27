import React from "react";
import { FormLabel, Dialog, DialogTitle, DialogActions, Button } from "@material-ui/core";
import { S3Image, PhotoPicker } from "aws-amplify-react";
import ReactCrop, { Crop } from "react-image-crop";
import { ImagePickerProps, ImagePickerState } from "./interfaces/ImagePicker.i";
import "react-image-crop/dist/ReactCrop.css";
import { Toaster } from "../utils";

/**
 * TODO
 * [ ] Fix onPick not working when removing and adding an image
 */

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
};

class ImagePicker extends React.Component<ImagePickerProps, ImagePickerState> {
  public readonly state = initialState;

  public imageRef;
  public fileUrl;

  // set the props to be the style if they are present, or use the default theme
  private styles = this.props.theme || {
    formContainer: {
      margin: 0,
      padding: "5px",
    },
    formSection: {
      width: "200px",
      minWidth: "200px",
      boxShadow: "none",
      padding: 0,
    },
    sectionBody: {
      display: "none",
    },
    sectionHeader: {
      display: "none",
    },
    photoPickerButton: {
      background: "#ff80f7",
      marginTop: "10px",
      borderRadius: "5px",
      border: "1px solid #ff52f4",
      textTransform: "uppercase",
      display: "block",
      fontSize: "14px",
      padding: "8px",
    },
  };

  /**
   * Set the image to be the imageRef when it first loads
   * @param {HTMLImageElement}
   */
  public onImageLoaded = (image: HTMLImageElement): void => {
    this.imageRef = image;
  };

  /**
   * Function to run when the cropping is completed by the user
   * @param {Crop} crop - The dimensions of the cropped image
   */
  public onCropComplete = (crop): void => {
    this.makeClientCrop(crop);
  };

  /**
   * Save the dimensions of the cropped image to state when they are changed by the user
   * @param {Crop} crop - the dimensions of the cropped image
   * @param {Crop} percentCrop - the optional smaller percentage of the dimensions of the cropped image.
   */
  public onCropChange = (
    crop: Crop,
    // percentCrop
  ): void => {
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  /**
   * Creates a file from the dimensions of crop which were created by the user initiating image cropping.
   * @param {Crop} crop - the dimensions of the desired area.
   */
  public makeClientCrop = async (crop): Promise<void> => {
    console.log(this.imageRef);
    if (this.imageRef && crop.width && crop.height) {
      // get the blob data
      const croppedImage: Blob = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg",
      );
      // convert to file to be saved to S3
      const file = new File([croppedImage], "croppedImage.jpeg", {
        type: "image/jpeg",
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
    console.log(image);
    // create the canvas to place the cropped image in
    const canvas = document.createElement("canvas");
    // set the scale for the image
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    // set the dimensions for the image
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    // draw the cropped image onto the canvas
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

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob: any) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
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
    } = this.props;
    const { imagePreview, src, crop, cropperOpen, croppedImage } = this.state;

    return (
      <>
        <FormLabel className="profile__input">{showText && "Display Image:"}</FormLabel>
        <div
          className={
            profile ? "image__profile-container" : "image__placeholder-container"
          }
        >
          {/* Show image preview if one exists */}
          {imagePreview ? (
            <div
              className={
                profile ? "image__profile-container" : "image__placeholder-container"
              }
            >
              <img className="image__image" src={imagePreview} alt="Product Preview" />
            </div>
          ) : // Show saved S3 image if passed through via props
          savedS3Image ? (
            <S3Image
              imgKey={savedS3Image.key}
              theme={{
                photoImg: { maxWidth: "100%" },
              }}
            />
          ) : (
            // else show the placeholder/savedImage if profile boolean prop is true.
            profile && <img src={savedImage} alt="Profile" className="image__image" />
          )}
        </div>
        {/* only show PhotoPicker if the disabled prop is not true/defined */}
        {!disabled && (
          <PhotoPicker
            title={update ? "Add another image" : "Select an image"}
            preview="hidden"
            headerHint="This can be changed anytime."
            headerText="Add a display image"
            onLoad={(url): void => {
              this.setState({ src: url, cropperOpen: true });
              setImagePreview && setImagePreview(url);
            }}
            // onPick={(file): void => setImageFile(file)}
            theme={this.styles}
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
                  setImageFile(croppedImage);
                } catch (err) {
                  Toaster.show({
                    intent: "danger",
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

export default ImagePicker;
