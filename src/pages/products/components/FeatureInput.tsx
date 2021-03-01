/* eslint-disable react/destructuring-assignment */
import {
  Typography,
  Slider,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  makeStyles,
} from "@material-ui/core";
import React, { useState } from "react";
import ChipInput from "../../../common/inputs/ChipInput";
import { getReadableStringFromArray } from "../../../utils";
import { marks } from "../../../utils/data";
import { openSnackbar } from "../../../utils/Notifier";
import {
  Feature,
  FeatureType,
  InputType,
  Variant,
  VariantsState,
} from "../interfaces/Variants.i";
import styles from "../styles/variants.style";
import VariantCard from "./VariantCard";

interface FeatureInputProps {
  size: "small" | "medium";
  type: "Cake" | "Creates";
  featureIdx: number | null;
  addFeaturesToVariant: (features: Feature[]) => void;
  variantIdx: number;
  handleAddVariant: (features?: Feature[]) => void;
  variants: Variant[];
  updateVariants: (variants: Variant[]) => void;
  handleCancel: () => void;
  updateVariantData: (state: Partial<VariantsState>) => void;
}

interface FeatureInputState {
  inputType: InputType;
  featureType: FeatureType;
  featureName: string;
  description: string;
  array: string[];
  number: number;
  featureIdx: number | null;
  features: Feature[];
  range: number[];
  errors: {
    action: string;
    inputType: string;
    featureType: string;
    featureName: string;
    description: string;
    array: string;
  };
}

const initialState: FeatureInputState = {
  inputType: "",
  featureType: "",
  featureName: "",
  description: "",
  array: [],
  features: [],
  number: 1,
  range: [0, 1],
  featureIdx: null,
  errors: {
    action: "",
    inputType: "",
    featureType: "",
    featureName: "",
    description: "",
    array: "",
  },
};

const FeatureInput: React.FC<FeatureInputProps> = ({
  size,
  type,
  variantIdx,
  handleAddVariant,
  handleCancel,
  variants,
  updateVariants,
  updateVariantData,
}) => {
  const [state, setState] = useState<FeatureInputState>(initialState);

  // useEffect(() => {
  //   setState({ ...state, featureIdx });
  // }, [featureIdx]);

  const useStyles = makeStyles(styles);
  const classes = useStyles();

  /**
   * Method to render an array of JSX which will contain unordered list, containing each
   * individual feature, along with the values that are set.
   * @param chosenFeatures - optional array of features which will be used if present
   * @param showDelete - boolean value to determine if the delete icon should be shown
   */
  const renderCurrentFeatures = (
    chosenFeatures?: Feature[],
    showDelete = true,
  ): JSX.Element[] | null => {
    // initialise variable to hold features
    let features;
    if (!chosenFeatures) {
      // if theres no chosen features passed as a parameter, use features in state
      features = state.features;
    } else {
      // if chosen features is passed as a parameter, use it.
      features = chosenFeatures;
    }
    console.log(features);
    if (!features.length) return null;

    /**
     * Function to format featureType and their values into a human readable string
     * so the admin can have an overview of what's being done with minimum effort.
     * @param featureType
     * @param value
     */
    const formatText = (featureType: FeatureType, value: number | number[]): string => {
      switch (featureType) {
        case "images":
          return `image${value > 1 ? "s" : ""}`;
        case "text": {
          return `piece${value > 1 ? "s" : ""} of text.`;
        }
        default:
          return "";
      }
    };
    // create an array to store all of the JSX in.
    const data: JSX.Element[] = [];
    // iterate through each feature in features array
    features.forEach((feature, i): void => {
      // destructure all relevant properties
      const { name, featureType, inputType } = feature;
      let description;
      // set description to be the values set from the user in a human readable format
      switch (inputType) {
        case "range": {
          const value = feature.value.range as number[];
          description = `User inputs between ${value[0]} and ${value[1]} ${formatText(
            featureType,
            value[1],
          )}`;
          break;
        }
        case "number": {
          const value = feature.value.number as number;
          description = `User inputs only ${value} ${formatText(featureType, value)}`;
          break;
        }
        case "array": {
          const value = feature.value.array as string[];
          description = `User picks one item from ${getReadableStringFromArray(value)} `;
          break;
        }
        default:
          return;
      }
      // create the list item with the name and description created above
      data.push(
        <li
          key={i}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "nowrap",
            maxWidth: 400,
          }}
        >
          <p className={classes.feature}>
            <span className={classes.name}>{name}</span> - {description}
          </p>
          {/* if showDelete is true (from params) then show both delete and edit icons */}
          {showDelete && (
            <div style={{ display: "inline-flex" }}>
              <i
                role="button"
                tabIndex={0}
                className={`fas fa-times ${classes.removeIcon}`}
                onClick={(): void => {
                  // removes current feature from features array
                  const { features } = state;
                  setState({
                    ...state,
                    features: [...features.slice(0, i), ...features.slice(i + 1)],
                  });
                }}
              />
              <i
                role="button"
                tabIndex={0}
                className={`fas fa-pencil-alt ${classes.editIcon}`}
                style={{ cursor: "pointer" }}
                onClick={(): void => {
                  // sets the value of the current variant into state so it can be edited and saved
                  setState((prevState) => ({
                    ...prevState,
                    featureType: feature.featureType,
                    inputType: feature.inputType,
                    featureName: feature.name,
                    range: feature.value?.range ?? prevState.range,
                    number: feature.value?.number ?? prevState.number,
                    array: feature.value?.array ?? [],
                    featureIdx: i,
                    description: feature?.description ?? "",
                  }));
                }}
              />
            </div>
          )}
        </li>,
      );
    });
    // return the jsx array to be rendered
    console.log(data);
    return data;
  };

  /**
   * Method to add (or edit) a completed feature and set it into state so it
   * can be eventually be saved as a full Variant in the parent component.
   */
  const handleAddFeature = (): void => {
    // destructure necessary values from state
    const {
      inputType,
      featureType,
      number,
      features,
      array,
      range,
      featureName,
      featureIdx,
      description,
    } = state;

    let anyErrors = false;
    const updatedErrors = {
      featureType: "",
      featureName: "",
      inputType: "",
      description: "",
      action: "",
      array: "",
    };
    if (!featureType.length) {
      anyErrors = true;
      updatedErrors.featureType = "Please add a user action.";
      updatedErrors.action = "Please fix the above errors before continuing.";
    }
    if (!featureName.length) {
      anyErrors = true;
      updatedErrors.featureName = "Please add a feature name.";
      updatedErrors.action = "Please fix the above errors before continuing.";
    }
    if (!inputType.length) {
      anyErrors = true;
      updatedErrors.inputType = "Please enter the required values.";
      updatedErrors.action = "Please fix the above errors before continuing.";
    }
    if (description.length > 0 && description.length < 10) {
      anyErrors = true;
      updatedErrors.description = "Please enter a valid description (min 10 chars).";
    }
    if (inputType === "array" && array.length <= 1) {
      anyErrors = true;
      updatedErrors.array = "Please enter at least 2 choices.";
    }
    if (anyErrors) {
      setState({
        ...state,
        errors: updatedErrors,
      });
      return openSnackbar({
        severity: "error",
        message: "Please fix all of the errors before continuing.",
      });
    }

    // initialise a variable to hold feature data
    let feature;
    switch (inputType) {
      // if input type is number, use the necessary values from state and use number as value
      case "number":
        feature = {
          name: featureName,
          value: { number },
          featureType,
          inputType,
          description,
        };
        break;
      // if input type is array, use the necessary values from state and use array as value
      case "array":
        feature = {
          name: featureName,
          value: { array },
          featureType,
          inputType,
          description,
        };
        break;
      // if input type is range, use the necessary values from state and use range as value
      case "range":
        feature = {
          name: featureName,
          value: { range },
          featureType,
          inputType,
          description,
        };
        break;
      default:
        break;
    }
    let updatedState = state;
    // if featureIdx isn't null, then you will need to overwrite that value rather than create a new one
    if (featureIdx !== null) {
      // save features in a new value so it can be mutated
      const updatedFeatures = features;
      // mutate the value at the featureIdx to be the feature created above
      updatedFeatures[featureIdx] = feature as Feature;
      // update the features in state and set featureIdx to null so nothing will be overwritten later
      updatedState = {
        ...updatedState,
        features: updatedFeatures,
        featureIdx: null,
      };
    } else {
      // if there is no featureIdx then a new value should be created if it doesn't already exist
      // set match to be false, which will be changed if there is a match of names in the array
      let match = false;
      // iterate through the features array
      features.forEach((feature) => {
        // if the feature.name is the same as featureName, theres a match, so set match to true.
        if (feature.name === featureName) {
          match = true;
          openSnackbar({
            severity: "error",
            message: `${feature.name} is already named as a feature.`,
          });
        }
      });
      // if there is no match, add the feature to the features array.
      if (!match) {
        updatedState = {
          ...updatedState,
          features: [...features, feature as Feature],
        };
      } else return;
    }
    // set state back to original state so features inputs are empty
    setState({
      ...updatedState,
      featureName: "",
      number: 1,
      range: [0, 1],
      array: [],
      inputType: "",
      featureType: "",
      description: "",
    });
  };

  /**
   * Method to render the inputs which will be used the create the parameters
   * of the variant creation, based on the inputType.
   */
  const renderType = (): JSX.Element | null => {
    // destructure relevant properties
    const { number, array, range, featureName, inputType, errors, featureIdx } = state;
    switch (inputType) {
      /**
       * if the inputType is number, render a Slider component with one values. The value of
       * this step determines the amount of featureName is required to complete the task.
       * E.g. if featureName is images, and the slider is set to 4, the user would have
       * to upload 4 images for it to be classed a valid input.
       */

      case "number":
        return (
          <>
            <Typography gutterBottom style={{ textAlign: "center" }}>
              Number of {featureName}
            </Typography>
            <Slider
              value={number}
              step={1}
              min={1}
              max={32}
              valueLabelDisplay="auto"
              onChange={(_e, number): void =>
                setState({ ...state, number: number as number })
              }
              marks={marks.slice(1)}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddFeature}
              style={{ margin: "4px 0 10px" }}
            >
              {featureIdx === null ? "Add Feature" : "Update Feature"}
            </Button>
          </>
        );
      case "range":
        /**
         * if the inputType is range, a slider with two values will be rendered. The lesser
         * value will be stored in range[0] and the larger will be stored in range[2].
         */
        return (
          <>
            <Typography gutterBottom>Range of {featureName}</Typography>
            <Slider
              value={range}
              step={1}
              min={0}
              max={32}
              valueLabelDisplay="auto"
              onChange={(_e, range): void =>
                setState({ ...state, range: range as number[] })
              }
              marks={marks}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddFeature}
              style={{ margin: "4px 0 10px" }}
              disabled={range[0] === range[1] || range[1] < range[0]}
            >
              {featureIdx === null ? "Add Feature" : "Update Feature"}
            </Button>
          </>
        );
      case "array": {
        /**
         * If the inputType is array then a chip input will be rendered, where the user
         * can add values into it. These values will normally be used to render a select
         * component (dropdown).
         */
        return (
          <>
            <Typography variant="subtitle2" style={{ marginBottom: 8 }}>
              Enter all of your choices{featureName.length > 0 && ` for ${featureName}`}.
              Press enter to save a choice.
            </Typography>
            <ChipInput
              label={`${featureName} Choices`}
              value={array}
              onChange={(_event, value): void => {
                setState({
                  ...state,
                  array: value as string[],
                  errors: {
                    ...errors,
                    array: "",
                  },
                });
              }}
              options={[]}
              fullWidth
              freeSolo
              errors={errors.array}
              tagClass={type === "Cake" ? classes.chipCake : classes.chipCreates}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddFeature}
              style={{ margin: "4px 0 10px" }}
              disabled={array.length === 0}
            >
              {featureIdx === null ? "Add Feature" : "Update Feature"}
            </Button>
          </>
        );
      }
      default:
        return null;
    }
  };

  const { errors, featureType, inputType, featureName, description, features } = state;

  return (
    <>
      <div className={classes.dividerContainer}>
        <Typography className={classes.dividerText}>Add Features</Typography>
        <Divider variant="middle" style={{ margin: "30px auto" }} />
      </div>
      <Typography
        variant="subtitle2"
        style={{ marginBottom: 8, color: "rgba(0,0,0,0.7)" }}
      >
        Enter the name of the customisable option and choose a value type to reveal the
        input.
      </Typography>
      <Grid container style={{ marginBottom: 8 }}>
        <Grid item xs={12} sm={4}>
          <FormControl
            error={!!errors.featureType}
            variant="outlined"
            className={classes.formControl}
            size={size}
          >
            <InputLabel id="feature-type-label" variant="outlined">
              User Action
            </InputLabel>
            <Select
              value={featureType}
              fullWidth
              labelWidth={200}
              error={!!errors.featureType}
              label="User Action"
              variant="outlined"
              style={
                size === "medium"
                  ? {
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }
                  : { marginBottom: 10 }
              }
              onChange={(e): void => {
                const featureType = e.target.value as FeatureType;
                const updatedState = state;
                updatedState.featureType = featureType;
                if (featureType === "images") {
                  updatedState.featureName = "Images";
                } else {
                  updatedState.featureName = "";
                }
                if (featureType === "other") {
                  updatedState.inputType = "array";
                }
                setState({
                  ...state,
                  ...updatedState,
                  errors: {
                    ...errors,
                    featureType: "",
                    featureName: "",
                    inputType: "",
                    action: "",
                  },
                });
              }}
            >
              <MenuItem value="">
                <em>Pick a Value</em>
              </MenuItem>
              <MenuItem value="images">User Uploads Image</MenuItem>
              <MenuItem value="text">User Inputs Text</MenuItem>
              <MenuItem value="other">User Picks From Choice</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            variant="outlined"
            label="Feature Name"
            value={featureName}
            disabled={featureName === "Images"}
            size={size}
            error={!!errors.featureName}
            InputProps={{
              classes: {
                notchedOutline: size === "medium" ? classes.input : "",
              },
            }}
            fullWidth
            onChange={(e): void =>
              setState({
                ...state,
                featureName: e.target.value,
                errors: {
                  ...errors,
                  featureType: "",
                  featureName: "",
                  inputType: "",
                  action: "",
                },
              })
            }
            style={
              size === "medium"
                ? {}
                : {
                    marginBottom: 8,
                  }
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl
            variant="outlined"
            error={!!errors.inputType}
            className={classes.formControl}
            size={size}
          >
            <InputLabel
              id="input-type-label"
              error={!!errors.inputType}
              variant="outlined"
            >
              Required Values
            </InputLabel>
            <Select
              value={inputType}
              fullWidth
              labelId="input-type-label"
              id="input-type"
              disabled={featureName?.length === 0}
              label="Required Values"
              variant="outlined"
              error={!!errors.inputType}
              style={
                size === "medium"
                  ? {
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }
                  : { marginBottom: 20 }
              }
              onChange={(e): void =>
                setState({
                  ...state,
                  inputType: e.target.value as InputType,
                  errors: {
                    ...errors,
                    featureType: "",
                    featureName: "",
                    inputType: "",
                    action: "",
                  },
                })
              }
            >
              <MenuItem value="">
                <em>Pick a Value</em>
              </MenuItem>
              <MenuItem value="number">Requires Exact Number</MenuItem>
              <MenuItem value="range">Requires Min & Max Range</MenuItem>
              {featureType === "other" && (
                <MenuItem value="array">Multiple Choice</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
        {errors.action && (
          <Typography className={classes.error}>{errors.action}</Typography>
        )}
        <Grid item xs={12}>
          <TextField
            value={description}
            label="Description (optional)"
            fullWidth
            error={!!errors.description}
            helperText={errors.description}
            style={{ marginTop: 8 }}
            size={size}
            placeholder="Describe the feature"
            onChange={(e): void =>
              setState({
                ...state,
                description: e.target.value,
                errors: { ...errors, description: "" },
              })
            }
            variant="outlined"
          />
        </Grid>
      </Grid>
      <div className={classes.typeContainer}>{renderType()}</div>
      {features.length > 0 && <ul style={{ margin: 0 }}>{renderCurrentFeatures()}</ul>}
      <Divider variant="middle" style={{ margin: "20px auto" }} />
      <div className={classes.buttonContainer}>
        {variantIdx !== null && (
          <Button
            variant="text"
            color="secondary"
            size="small"
            style={{ marginRight: 5 }}
            onClick={(): void => {
              setState(initialState);
              handleCancel();
            }}
          >
            Cancel
          </Button>
        )}
        <Button
          variant="outlined"
          color="primary"
          onClick={(): void => {
            setState(initialState);
            handleAddVariant(features);
          }}
          size="small"
        >
          {variantIdx !== null ? "Update Variant" : "Save Variant"}
        </Button>
      </div>
      <Grid container spacing={1}>
        {variants?.length > 0 &&
          variants.map((variant: Variant, i: number) => (
            <VariantCard
              variant={variant}
              i={i}
              key={i}
              variants={variants}
              updateVariants={updateVariants}
              currentFeatures={features}
              updateVariantData={(data): void => {
                if (data.features) {
                  setState({ ...state, features: data.features });
                }
                updateVariantData(data);
              }}
            />
          ))}
      </Grid>
    </>
  );
};

export default FeatureInput;
