import React, { useState } from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  Select,
  MenuItem,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import ChipInput from "material-ui-chip-input";
import { useDispatch, useSelector } from "react-redux";
import { ExpandMore } from "@material-ui/icons";
import { COLORS, INTENT } from "../../../themes";
import { Feature, Variant } from "../../accounts/interfaces/Variants.i";
import { openSnackbar } from "../../../utils/Notifier";
import styles from "../styles/basketCustomOptions.style";
import { CustomOptionsProps, CustomOptionsState } from "../interfaces/Basket.i";
import { AppState } from "../../../store/store";

const BasketCustomOptions: React.FC<CustomOptionsProps> = ({
  setCustomOptions,
  customOptions,
  currentVariant,
}) => {
  const [state, setState] = useState<CustomOptionsState>({
    currentTextValue: "",
    currentArrayValue: [],
    currentImagesArray: [],
    currentMultipleChoice: "",
    uploadedImage: null,
    imageCompleted: false,
    confirmDialogOpen: false,
    currentImageFile: null,
    imageCount: 0,
    expanded: false,
  });

  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const dispatch = useDispatch();
  const { products } = useSelector(({ basket }: AppState) => basket.checkout);

  const handlePanelChange = (panel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean,
  ): void => {
    setState({
      ...state,
      expanded: isExpanded ? panel : false,
    });
  };

  const renderInput = (feature: Feature, i: number): JSX.Element | null => {
    const {
      currentTextValue,
      currentArrayValue,
      currentMultipleChoice,
      currentImagesArray,
      uploadedImage,
      currentImageFile,
      imageCount,
      confirmDialogOpen,
    } = state;
    const { featureType, inputType, value, name } = feature;
    let renderedFeature: JSX.Element | null = null;

    let maxNumber = -1;
    if (inputType === "range" && value.range !== undefined) {
      maxNumber = value.range[1];
    } else if (inputType === "number" && value.number !== undefined) {
      maxNumber = value.number;
    }

    const checkImageCompletion = (): void => {
      const { imageCount } = state;
      if (imageCount < maxNumber) {
        setState({ ...state, confirmDialogOpen: true });
      } else {
        const updatedCustomOptions = customOptions;
        updatedCustomOptions[i] = currentImagesArray;
        setState({
          ...state,
          imageCompleted: true,
          expanded: `panel${i + 1}`,
          currentImagesArray: [],
        });
        setCustomOptions(updatedCustomOptions);
      }
    };

    switch (featureType) {
      case "text": {
        renderedFeature =
          inputType === "range" || (inputType === "number" && maxNumber > 1) ? (
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <Typography variant="subtitle2">
                Please add {inputType === "range" ? "up to" : "exactly"} {maxNumber} items
              </Typography>
              <div style={{ display: "inline-flex" }}>
                <ChipInput
                  value={currentArrayValue}
                  fullWidth
                  variant="outlined"
                  label={name}
                  // @ts-ignore
                  placeholder="Press enter to add an item"
                  onAdd={(chip): void => {
                    if (currentArrayValue.length < maxNumber) {
                      setState({
                        ...state,
                        currentArrayValue: [...currentArrayValue, chip],
                      });
                    } else {
                      openSnackbar({
                        severity: INTENT.Warning,
                        message: `You can only add ${maxNumber} items.`,
                      });
                    }
                  }}
                />
                <Button
                  onClick={(): void => {
                    const updatedCustomOptions = customOptions;
                    updatedCustomOptions[i] = currentArrayValue;
                    setState({
                      ...state,
                      currentArrayValue: [],
                      expanded: `panel${i + 1}`,
                    });
                    setCustomOptions(updatedCustomOptions);
                  }}
                  color="primary"
                  disabled={currentArrayValue.length === 0}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <Typography variant="subtitle2">
                Please add exactly {maxNumber} items
              </Typography>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                }}
              >
                <TextField
                  value={currentTextValue}
                  fullWidth
                  label={name}
                  variant="outlined"
                  onChange={(e): void =>
                    setState({ ...state, currentTextValue: e.target.value })
                  }
                />
                <Button
                  onClick={(): void => {
                    const updatedCustomOptions = customOptions;
                    updatedCustomOptions[i] = currentTextValue;
                    console.log("custom", updatedCustomOptions);
                    setState({
                      ...state,
                      currentTextValue: "",
                      expanded: `panel${i + 1}`,
                    });
                    setCustomOptions(updatedCustomOptions);
                  }}
                  color="primary"
                  disabled={currentTextValue?.length === 0}
                >
                  Next
                </Button>
              </div>
            </div>
          );
        break;
      }
      case "other":
        if (value.array === undefined) return null;
        renderedFeature = (
          <>
            <Select
              value={currentMultipleChoice}
              label={name}
              variant="outlined"
              onChange={(e): void =>
                setState({ ...state, currentMultipleChoice: e.target.value as string })
              }
              style={{ minWidth: 160 }}
            >
              {value.array.map((val, i) => (
                <MenuItem value={val} key={i}>
                  {val}
                </MenuItem>
              ))}
            </Select>
            <Button
              onClick={(): void => {
                const updatedCustomOptions = customOptions;
                updatedCustomOptions[i] = currentMultipleChoice;
                setState({
                  ...state,
                  currentMultipleChoice: "",
                  expanded: `panel${i + 1}`,
                });
                setCustomOptions(updatedCustomOptions);
              }}
              color="primary"
              disabled={currentMultipleChoice.length === 0}
            >
              Next
            </Button>
          </>
        );
        break;
      case "images":
        {
          renderedFeature = (
            <>
              <div className={classes.uploadedImageContainer}>
                {inputType === "range" ? (
                  <Typography variant="subtitle2" style={{ marginBottom: 8 }}>
                    Please add up to {maxNumber} images and upload them in the order you
                    wish to have them in.
                  </Typography>
                ) : (
                  <Typography variant="subtitle2" style={{ marginBottom: 8 }}>
                    Please add {maxNumber} images.
                  </Typography>
                )}
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
                            reader.onload = function (e): void {
                              if (e.target !== null) {
                                setState({
                                  ...state,
                                  uploadedImage: e.target.result as string,
                                  currentImageFile: file,
                                });
                              } else {
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
                      <Typography variant="subtitle2">
                        You have entered {imageCount} image(s).
                      </Typography>
                      {currentImagesArray.length < maxNumber && (
                        <Button variant="contained" component="span" color="primary">
                          Upload Image
                        </Button>
                      )}
                    </label>
                    {currentImagesArray.length >= 1 && (
                      <div className={classes.buttonContainer}>
                        <Button
                          onClick={(): void =>
                            setState({ ...state, currentImagesArray: [] })
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
                            currentImagesArray.length !== value.number
                          }
                        >
                          Next
                        </Button>
                      </div>
                    )}
                    <Dialog
                      open={confirmDialogOpen}
                      onClose={(): void =>
                        setState({ ...state, confirmDialogOpen: false })
                      }
                      fullScreen={fullScreen}
                    >
                      <DialogTitle>
                        Do you want to have less than the recommended amount of images?
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          You have uploaded {imageCount} images, when the recommended is{" "}
                          {maxNumber}.
                        </DialogContentText>
                        <DialogContentText>
                          Do you want to continue with the current amount?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={(): void => {
                            const updatedCustomOptions = customOptions;
                            updatedCustomOptions[i] = currentImagesArray;
                            setState({
                              ...state,
                              imageCompleted: true,
                              expanded: `panel${i + 1}`,
                              currentImagesArray: [],
                            });
                            setCustomOptions(updatedCustomOptions);
                          }}
                        >
                          Yes
                        </Button>
                        <Button
                          onClick={(): void =>
                            setState({ ...state, confirmDialogOpen: false })
                          }
                        >
                          No
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </>
                ) : (
                  <>
                    <img
                      src={uploadedImage}
                      alt="Your uploaded image"
                      className={classes.previewImage}
                    />
                    <div>
                      <Button
                        onClick={(): void =>
                          setState({
                            ...state,
                            currentImageFile: null,
                            uploadedImage: null,
                          })
                        }
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={(): void => {
                          setState({
                            ...state,
                            currentImagesArray: [
                              ...currentImagesArray,
                              currentImageFile as File,
                            ],
                            uploadedImage: null,
                            currentImageFile: null,
                            imageCount: imageCount + 1,
                          });
                          if (currentImagesArray.length === maxNumber) {
                            const updatedCustomOptions = customOptions;
                            updatedCustomOptions[i] = currentImagesArray;
                            setState({
                              ...state,
                              currentImagesArray: [],
                              imageCount: 0,
                            });
                            setCustomOptions(updatedCustomOptions);
                          }
                        }}
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
    return renderedFeature;
  };

  const { expanded, currentArrayValue, currentTextValue, imageCompleted } = state;
  return (
    <div>
      <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
        Customisable Features
      </Typography>
      {currentVariant.features.map((feature: Feature, i: number) => {
        return (
          <Accordion
            expanded={expanded === `panel${i}`}
            key={i}
            onChange={handlePanelChange(`panel${i}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls={`panel${i}-content`}
              id={`panel${i}-header`}
            >
              <Typography className={classes.heading}>{feature.name}</Typography>
              <Typography className={classes.secondaryHeading}>
                {customOptions[i] !== undefined ||
                (feature.featureType === "images" && imageCompleted) ? (
                  <span style={{ color: COLORS.SuccessGreen, fontStyle: "italic" }}>
                    Complete
                  </span>
                ) : (
                  <span style={{ color: COLORS.ErrorRed, fontStyle: "italic" }}>
                    Incomplete
                  </span>
                )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {customOptions[i] ? (
                <>
                  {!Array.isArray(customOptions[i]) && (
                    <Typography>{customOptions[i]}</Typography>
                  )}
                  <Button
                    onClick={(): void => {
                      const updatedCustomOptions = customOptions;
                      const prevValue = customOptions[i];
                      updatedCustomOptions[i] = undefined;
                      setState({
                        ...state,
                        currentTextValue:
                          typeof prevValue === "string" ? prevValue : currentTextValue,
                        currentArrayValue: Array.isArray(prevValue)
                          ? prevValue
                          : currentArrayValue,
                      });
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
                      updatedCustomOptions[i] = undefined;
                      setCustomOptions(updatedCustomOptions);
                    }}
                    variant="text"
                    color="secondary"
                  >
                    Clear
                  </Button>
                </>
              ) : (
                renderInput(feature, i)
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
};

export default BasketCustomOptions;
