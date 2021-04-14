import {
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles,
  useMediaQuery,
} from "@material-ui/core";
import { Storage } from "aws-amplify";
import React, { useState, useEffect } from "react";
import { breakpoints, INTENT } from "../../../themes";
import { openSnackbar } from "../../../utils/Notifier";
import { UploadedFile } from "../../products/interfaces/NewProduct.i";
import { S3ImageProps } from "../../accounts/interfaces/Product.i";
import awsExports from "../../../aws-exports";
import styles from "../styles/renderInput.style";
import UploadedImages from "./UploadedImages";
import { getReadableStringFromArray, handleRemoveFromS3 } from "../../../utils";
import { RenderInputProps, RenderInputState } from "../interfaces/RenderInput.i";
import ChipInput from "../../../common/inputs/ChipInput";

/**
 * Functional component to render the inputs for the user to complete their products'
 * customisable options inside the Basket and BasketCustomOptions components.
 * @param feature - The current feature that should be rendered inside the component
 * @param i - The current index of the rendered feature
 * @param setCustomOptions - Function to update the custom options array in parent
 * @param setExpanded - Function to update the current expanded accordion from parent
 * @param featuresLength - The number of features expected to be rendered by the component
 */
const RenderInput: React.FC<RenderInputProps> = ({
  feature,
  i,
  setCustomOptions,
  customOptions,
  setExpanded,
  featuresLength,
}): JSX.Element | null => {
  // make and use styles to be used in component
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  // initialise state to be empty inputs
  const [state, setState] = useState<RenderInputState>({
    currentInputValue: [],
    confirmDialogOpen: false,
    uploadedImage: null,
    currentImageFile: null,
    imageCompleted: false,
    maxNumber: 0,
    minNumber: 0,
  });

  // check to see if user is on small screen
  const mobile = useMediaQuery(breakpoints.down("xs"));

  /**
   * any time a value in feature changes, check the featureType and update the
   * currentInputValue so it can be used for the value of the input without
   * causing conflicting errors (i.e an array for a string input, or vice versa).
   */
  useEffect(() => {
    const { featureType, inputType } = feature;
    if (featureType === "text" && inputType !== "range") {
      setState({ ...state, currentInputValue: "" });
    } else {
      // if featureType is other, dropdown or images, the input value will need to be an array
      setState({ ...state, currentInputValue: [] });
    }
  }, [feature]);

  /**
   * When the component mounts, set the maxNumber and minNumber based on feature.value into
   * state
   */
  useEffect(() => {
    const { value } = feature;
    const maxNumber = value.range?.[1]! ?? value.number!;
    const minNumber = value.range?.[0]! ?? null;
    setState({ ...state, maxNumber, minNumber });
  }, []);

  // destructure all relevant data from state
  const { currentImageFile, confirmDialogOpen, currentInputValue, uploadedImage } = state;
  // destructure all relevant data from feature.
  const { featureType, inputType, value, name } = feature;
  const { maxNumber, minNumber } = state;

  // initialise variable to store jsx in.
  let renderedFeature: JSX.Element | null = null;

  /**
   * Function to check if the user has input the recommended amount of
   * images, based on the max range or number set for the current feature.
   */
  const checkImageCompletion = (): void => {
    const { maxNumber } = state;
    /**
     * store the currentInputValue into a variable, and cast it to S3ImageProps[]
     * so the array length can be checked.
     */
    const imagesArr = state.currentInputValue as S3ImageProps[];
    /**
     * if the length of imagesArr is less than maxNumber, open the image confirm
     * dialog by setting confirmDialogOpen to true. This dialog notifies the use
     * that they've input less than the recommended amount of images, and if they
     * want to continue with less images or add more before proceeding.
     */
    if (imagesArr.length < maxNumber) {
      setState({ ...state, confirmDialogOpen: true });
    } else {
      /**
       * If the length of imagesArr is the same or more than maxNumber, then the
       * user has uploaded the correct amount of images, and customOptions should
       * be updated to reflect this.
       */
      const updatedCustomOptions = customOptions;
      updatedCustomOptions[i] = {
        Images: imagesArr,
      };
      // set imageCompleted to true to show the completed tag on the accordion
      setState({ ...state, imageCompleted: true });
      // open the next panel if i is less than features length - 1, or color if not.
      setExpanded(i < featuresLength - 1 ? `panel${i + 1}` : `panel-color`);
      // save customOptions to state in parent
      setCustomOptions(updatedCustomOptions);
    }
  };

  /**
   * Switch statement to determine what input should be rendered inside the component.
   */
  switch (featureType) {
    /**
     * A chip input will be rendered if the inputType is range, or inputType is number
     * and the maxNumber is larger than 1.
     */
    case "text": {
      renderedFeature =
        inputType === "range" || (inputType === "number" && maxNumber > 1) ? (
          <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            {/* If there's a description, show it to the user */}
            {feature.description && (
              <Typography variant="subtitle2" style={{ marginBottom: 8 }}>
                {feature.description}
              </Typography>
            )}
            {/* Notify the user how many inputs they're expected to complete */}
            <Typography variant="subtitle2" style={{ marginBottom: 8 }}>
              Please add {inputType === "range" ? "up to" : "exactly"} {maxNumber} items
            </Typography>
            <div
              style={{
                display: "flex",
                flexDirection: mobile ? "column" : "row",
                alignItems: "center",
              }}
            >
              {/* Render the chip input */}
              <ChipInput
                value={currentInputValue as string[]}
                fullWidth
                options={[]}
                freeSolo
                label={name}
                tagClass={classes.chip}
                onChange={(_event, value, reason): void => {
                  if (reason === "remove-option") {
                    return setState({
                      ...state,
                      currentInputValue: value,
                    });
                  }
                  if ((currentInputValue as string[]).length < maxNumber) {
                    setState({
                      ...state,
                      currentInputValue: value,
                    });
                  } else {
                    /**
                     * If the inputValue length is equal to or greater than maxNumber, notify the user
                     * they can't add another chip
                     */
                    openSnackbar({
                      severity: INTENT.Warning,
                      message: `You can only add ${maxNumber} items.`,
                    });
                  }
                }}
                placeholder="Press enter to add an item"
              />
              <Button
                onClick={(): void => {
                  const updatedCustomOptions = customOptions;
                  updatedCustomOptions[i] = {
                    [name]: currentInputValue as string[],
                  };
                  // open the next panel if i is less than features length - 1, or color if not.
                  setExpanded(i < featuresLength - 1 ? `panel${i + 1}` : `panel-color`);
                  setCustomOptions(updatedCustomOptions);
                }}
                color="primary"
                disabled={
                  inputType === "range"
                    ? (currentInputValue as string[]).length < minNumber ||
                      (currentInputValue as string[]).length > maxNumber
                    : (currentInputValue as string[]).length !== maxNumber
                }
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          /**
           * A text field will be rendered if the inputType
           * is not range, or the inputType is number and the maxNumber is larger than 1.
           */
          <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            {/* If there is a description, show it to the user */}
            {feature.description && (
              <Typography variant="subtitle2" style={{ marginBottom: 8 }}>
                {feature.description}
              </Typography>
            )}
            {/* Notify the user of how many inputs they are expected to fill */}
            <Typography variant="subtitle2" style={{ marginBottom: 8 }}>
              Please add exactly {maxNumber} item {maxNumber === 1 ? "" : "s"}
            </Typography>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: mobile ? "column" : "row",
                width: "100%",
              }}
            >
              {/* Render the text field */}
              <TextField
                value={currentInputValue as string}
                fullWidth
                label={name}
                variant="outlined"
                onChange={(e): void =>
                  setState({ ...state, currentInputValue: e.target.value as string })
                }
              />
              {/* Render button to submit, which will be disabled if theres no string in text field */}
              <Button
                onClick={(): void => {
                  const updatedCustomOptions = customOptions;
                  updatedCustomOptions[i] = {
                    [name]: currentInputValue as string,
                  };
                  setState({
                    ...state,
                    currentInputValue: null,
                  });
                  // open the next panel if i is less than features length - 1, or color if not.
                  setExpanded(i < featuresLength - 1 ? `panel${i + 1}` : `panel-color`);
                  setCustomOptions(updatedCustomOptions);
                }}
                color="primary"
                disabled={(currentInputValue as string)?.length === 0}
                style={{ marginLeft: 5 }}
              >
                Next
              </Button>
            </div>
          </div>
        );
      break;
    }
    /**
     * If the featureType is other, then a select will need to be rendered with all
     * of the values placed inside it.
     */
    case "other":
    case "dropdown":
      {
        if (value.array === undefined) return null;
        renderedFeature = (
          <div>
            {/* If there is a description, show it to the user. */}
            {feature.description && (
              <Typography variant="subtitle2" style={{ marginBottom: 8 }}>
                {feature.description}
              </Typography>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: mobile ? "column" : "row",
                width: "100%",
                alignItems: "center",
              }}
            >
              {/* Render the select */}
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel>{name}</InputLabel>
                <Select
                  value={currentInputValue}
                  label={name}
                  fullWidth
                  variant="outlined"
                  onChange={(e): void =>
                    setState({
                      ...state,
                      currentInputValue: e.target.value as string,
                    })
                  }
                >
                  {/* Map each of the values into a MenuItem component, to render it
                  inside the select */}
                  {value.array.map((val, i) => (
                    <MenuItem value={val} key={i}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                onClick={(): void => {
                  const updatedCustomOptions = customOptions;
                  updatedCustomOptions[i] = {
                    [name]: currentInputValue as string,
                  };
                  // open the next panel if i is less than features length - 1, or color if not.
                  setExpanded(i < featuresLength - 1 ? `panel${i + 1}` : `panel-color`);
                  setCustomOptions(updatedCustomOptions);
                }}
                color="primary"
                disabled={!currentInputValue}
              >
                Next
              </Button>
            </div>
          </div>
        );
      }
      break;
    /**
     * If the featureType is images, then an input where the user can upload
     * images and saved into s3 should be rendered for the user.
     */
    case "images":
      {
        renderedFeature = (
          <>
            <div className={classes.uploadedImageContainer}>
              {/* If there's a description, show it to the user */}
              {feature.description && (
                <Typography variant="subtitle2">{feature.description}</Typography>
              )}
              {/* Notify the user how many images they're suggested to upload */}
              {inputType === "range" ? (
                <Typography variant="subtitle2" style={{ marginBottom: 8 }}>
                  Please add up to {maxNumber} images and upload them in the order you
                  wish to have them in.
                </Typography>
              ) : (
                <Typography variant="subtitle2" style={{ marginBottom: 8 }}>
                  Please add {maxNumber} image{maxNumber === 1 ? "" : "s"}.
                </Typography>
              )}
              {/* 
              If there's no uploadedImage set into state, show the input which will allow
              the user to upload an image
              */}
              {!uploadedImage ? (
                <>
                  <label
                    htmlFor="raised-button-file"
                    id="raised-button-label"
                    className={classes.imageLabel}
                  >
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="raised-button-file"
                      type="file"
                      onChange={(e): void => {
                        if (e.target.files) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = async function (e): Promise<void> {
                            // if there is something in e.target, start setup for saving it to s3
                            if (e.target !== null) {
                              // store filename in a variable for use later.
                              const filename = `/customImages/${Date.now()}/${file.name}`;
                              // put the file into aws with aws-amplify's Storage package.
                              const uploadedFile = await Storage.put(filename, file, {
                                contentType: file.type,
                                level: "public",
                              });
                              const { key } = uploadedFile as UploadedFile;
                              // set the file to contain the correct data
                              const s3 = {
                                key,
                                bucket: awsExports.aws_user_files_s3_bucket,
                                region: awsExports.aws_project_region,
                              };
                              // set stored image into uploadedImage, and store s3 to currentImageFile.
                              setState({
                                ...state,
                                uploadedImage: e.target.result as string,
                                currentImageFile: s3,
                              });
                            } else {
                              // if there was any error retrieving the image, notify the user.
                              openSnackbar({
                                severity: INTENT.Danger,
                                message: "Could not retrieve file. Please try again.",
                              });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {/* Notify the user how many images they've uploaded */}
                    <Typography variant="subtitle2" style={{ marginBottom: 8 }}>
                      You have entered{" "}
                      {(currentInputValue as S3ImageProps[])?.length ?? 0} image
                      {(currentInputValue as S3ImageProps[])?.length === 1 ? "" : "s"}.
                    </Typography>
                    {/* Show the button to the user - clicking it will trigger the above actions */}
                    {(currentInputValue as S3ImageProps[])?.length < maxNumber && (
                      <Button variant="contained" component="span" color="primary">
                        Upload Image
                      </Button>
                    )}
                  </label>
                  {/* If the minNumber is 0 and the input array is empty, give the user the option to skip */}
                  {minNumber === 0 &&
                    (currentInputValue as S3ImageProps[])?.length === 0 && (
                      <Button
                        variant="text"
                        onClick={(): void => {
                          const updatedCustomOptions = customOptions;
                          // set custom options to be empty array in parent
                          updatedCustomOptions[i] = {
                            Images: [],
                          };
                          setState({
                            ...state,
                            // set image completed to true to notify user its completed.
                            imageCompleted: true,
                          });
                          // open the next panel if i is less than features length - 1, or color if not.
                          setExpanded(
                            i < featuresLength - 1 ? `panel${i + 1}` : `panel-color`,
                          );
                          setCustomOptions(updatedCustomOptions);
                        }}
                        style={{ marginTop: 8 }}
                      >
                        Skip
                      </Button>
                    )}
                  {/* show the current uploaded images from the input array */}
                  {(currentInputValue as S3ImageProps[])?.length > 0 && (
                    <UploadedImages images={currentInputValue as S3ImageProps[]} />
                  )}
                  {/* If the user has uploaded one or more images, show the clear and next buttons */}
                  {(currentInputValue as S3ImageProps[])?.length >= 1 && (
                    <div className={classes.buttonContainer} style={{ marginTop: 10 }}>
                      <Button
                        onClick={(): void =>
                          setState({
                            ...state,
                            // set the input array to be empty
                            currentInputValue: [],
                          })
                        }
                        color="secondary"
                        variant="text"
                      >
                        Clear
                      </Button>
                      <Button
                        onClick={checkImageCompletion}
                        color="primary"
                        variant="text"
                        disabled={
                          inputType === "number" &&
                          (currentInputValue as S3ImageProps[])?.length !== value.number
                        }
                      >
                        Next
                      </Button>
                    </div>
                  )}
                  {/* If confirmDialogOpen is true, show the dialog */}
                  <Dialog
                    open={confirmDialogOpen}
                    onClose={(): void => setState({ ...state, confirmDialogOpen: false })}
                  >
                    <DialogTitle>
                      Continue with {(currentInputValue as S3ImageProps[])?.length} image
                      {(currentInputValue as S3ImageProps[]).length === 1 ? "" : "s"}
                    </DialogTitle>
                    <DialogContent>
                      <Typography variant="subtitle1" gutterBottom>
                        You have uploaded {(currentInputValue as S3ImageProps[])?.length}{" "}
                        images, when the recommended is {maxNumber}.
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        Do you want to continue with the current amount?
                      </Typography>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={(): void =>
                          // close the confirm dialog by changing the boolean value to false
                          setState({ ...state, confirmDialogOpen: false })
                        }
                        color="secondary"
                      >
                        No
                      </Button>
                      <Button
                        onClick={(): void => {
                          // update customOptions in parent and set imageCompleted to true.
                          const updatedCustomOptions = customOptions;
                          updatedCustomOptions[i] = {
                            Images: currentInputValue as S3ImageProps[],
                          };
                          // open the next panel if i is less than features length - 1, or color if not.
                          setExpanded(
                            i < featuresLength - 1 ? `panel${i + 1}` : `panel-color`,
                          );
                          setCustomOptions(updatedCustomOptions);
                          // set imageCompleted to true to show the user the feature is completed
                          setState({
                            ...state,
                            imageCompleted: true,
                            confirmDialogOpen: false,
                          });
                        }}
                        color="primary"
                      >
                        Yes
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              ) : (
                // if there is an image in uploadedImage state, ask the user if they want to upload it
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Do you want to add this image?
                  </Typography>
                  <div className={classes.uploadedImageContainer}>
                    <img
                      src={uploadedImage}
                      alt="Your uploaded image"
                      className={classes.previewImage}
                    />
                  </div>
                  <div className={classes.buttonContainer}>
                    {/* 
                      If they don't want to upload it, remove it from state and slice the
                      final item from the array
                    */}
                    <Button
                      onClick={async (): Promise<void> => {
                        // retrieve the key from the current image.
                        const key = currentImageFile?.key ?? null;
                        // if key is not null, remove it from s3
                        if (key) handleRemoveFromS3(key);
                        setState({
                          ...state,
                          // remove the s3 data and uploadedImage from state
                          currentImageFile: null,
                          uploadedImage: null,
                        });
                      }}
                      color="secondary"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={(): void => {
                        // push the new image into the updateImages array
                        const updatedImages = [
                          ...(currentInputValue as S3ImageProps[]),
                          currentImageFile as S3ImageProps,
                        ];
                        // if the length of updated images is the same as maxNumber, save customOptions
                        if (updatedImages.length === maxNumber) {
                          const updatedCustomOptions = customOptions;
                          updatedCustomOptions[i] = {
                            Images: updatedImages,
                          };
                          setState({
                            ...state,
                            // set updatedImages into state so it can be shown to the user while on accordion section
                            currentInputValue: updatedImages,
                            // remove the current uploaded image from state
                            uploadedImage: null,
                            // set imageCompleted to true to show the user the completed tag
                            imageCompleted: true,
                          });
                          // update custom options in parent
                          setCustomOptions(updatedCustomOptions);
                        } else {
                          setState({
                            ...state,
                            // remove current uploaded image src from state
                            uploadedImage: null,
                            // update input value with updatedImages
                            currentInputValue: updatedImages,
                            // remove s3 data from state
                            currentImageFile: null,
                          });
                        }
                      }}
                      color="primary"
                    >
                      Confirm
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        );
      }
      break;
    default:
      return null;
  }

  const current =
    typeof customOptions[i] === "object"
      ? // if the current customOptions index is an object, get the values from it with Object.values().
        Object.values(customOptions[i])[0]
      : // if not, get the value.
        customOptions[i];

  const key = customOptions[i] !== undefined && Object.keys(customOptions[i])[0];

  const { imageCompleted } = state;
  return (
    <div style={{ width: "100%" }}>
      {customOptions[i] ? (
        <>
          {/* If current is not an array, display the information to users */}
          <Typography variant="subtitle2">
            {!Array.isArray(current)
              ? current
              : typeof current[0] === "string" &&
                getReadableStringFromArray(current as string[])}
          </Typography>
          {/* 
            if imageComplete is true and the current index of customOptions key is 
            "Images" show the images within the UploadedImages component
           */}
          {imageCompleted && key === "Images" && (
            <UploadedImages images={current as S3ImageProps[]} />
          )}
          <div className={classes.buttonContainer}>
            <Button
              onClick={(): void => {
                const updatedCustomOptions = customOptions;
                const prevValue = customOptions[i];
                //@ts-expect-error
                updatedCustomOptions[i] = undefined;
                setState({
                  ...state,
                  // set the currentInputValue to be the prevValue's values
                  currentInputValue: Object.values(prevValue)[0] as unknown,
                });
                // update customOptions in parent
                setCustomOptions(updatedCustomOptions);
              }}
              variant="text"
              color="primary"
            >
              Edit
            </Button>
            <Button
              onClick={(): void => {
                const updatedCustomOptions = customOptions;
                //@ts-expect-error
                updatedCustomOptions[i] = undefined;
                setCustomOptions(updatedCustomOptions);
              }}
              variant="text"
              color="secondary"
            >
              Clear
            </Button>
          </div>
        </>
      ) : (
        // show rendered feature
        renderedFeature
      )}
    </div>
  );
};

export default RenderInput;
