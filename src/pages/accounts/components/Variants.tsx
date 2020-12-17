import React, { Component } from "react";
import {
  Typography,
  TextField,
  Button,
  Grid,
  withStyles,
  Select,
  MenuItem,
  Slider,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import ChipInput from "material-ui-chip-input";
import { DeleteRounded, EditRounded, FileCopyRounded } from "@material-ui/icons";
import OutlinedContainer from "../../../common/containers/OutlinedContainer";
import styles from "../styles/variants.style";
import {
  VariantsProps,
  VariantsState,
  Feature,
  InputType,
  FeatureType,
  Variant,
} from "../interfaces/Variants.i";
import { COLORS } from "../../../themes";
import { getReadableStringFromArray } from "../../../utils";
import { marks } from "../../../utils/data";

/**
 * TODO
 * [ ] Add "there's unsaved information" popup when saving to avoid lost data.
 * [ ] Check errors
 */

/**
 * Class component which renders a set of inputs which allow an admin user to
 * create a variant of a product so a customer can customise and fine-tune their
 * order.
 */
class Variants extends Component<VariantsProps, VariantsState> {
  public readonly state: VariantsState = {
    dimensions: "",
    price: {
      item: 0,
      postage: 0,
    },
    featureName: "",
    inputType: "",
    featureType: "",
    range: [0, 1],
    number: 1,
    array: [],
    features: [],
    currentIdx: 1,
    variantName: "",
    errors: {
      number: "",
      range: "",
      array: "",
      dimensions: "",
      item: "",
      postage: "",
      feature: "",
    },
    variantIdx: null,
    instructions: "",
    featureIdx: null,
    featureDesc: "",
  };

  /**
   * Method to add (or edit) a completed feature and set it into state so it
   * can be eventually be saved as a full Variant in the parent component.
   */
  private handleAddFeature = (): void => {
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
      featureDesc,
    } = this.state;

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
          description: featureDesc,
        };
        break;
      // if input type is array, use the necessary values from state and use array as value
      case "array":
        feature = {
          name: featureName,
          value: { array },
          featureType,
          inputType,
          description: featureDesc,
        };
        break;
      // if input type is range, use the necessary values from state and use range as value
      case "range":
        feature = {
          name: featureName,
          value: { range },
          featureType,
          inputType,
          description: featureDesc,
        };
        break;
      default:
        break;
    }

    // if featureIdx isn't null, then you will need to overwrite that value rather than create a new one
    if (featureIdx !== null) {
      // save features in a new value so it can be mutated
      const updatedFeatures = features;
      // mutate the value at the featureIdx to be the feature created above
      updatedFeatures[featureIdx] = feature as Feature;
      // update the features in state and set featureIdx to null so nothing will be overwritten later
      this.setState({
        features: updatedFeatures,
        featureIdx: null,
      });
    } else {
      // if there is no featureIdx then a new value should be created if it doesn't already exist
      // set match to be false, which will be changed if there is a match of names in the array
      let match = false;
      // iterate through the features array
      features.forEach((feature) => {
        // if the feature.name is the same as featureName, theres a match, so set match to true.
        if (feature.name === featureName) match = true;
      });
      // if there is no match, add the feature to the features array.
      if (!match) {
        this.setState({
          features: [...features, feature as Feature],
        });
      }
    }
    // set state back to original state so features inputs are empty
    this.setState({
      featureName: "",
      number: 1,
      range: [0, 1],
      array: [],
      inputType: "",
      featureType: "",
      featureDesc: "",
    });
  };

  /**
   * Method to render an array of JSX which will contain unordered list, containing each
   * individual feature, along with the values that are set.
   * @param chosenFeatures - optional array of features which will be used if present
   * @param showDelete - boolean value to determine if the delete icon should be shown
   */
  private renderCurrentFeatures = (
    chosenFeatures?: Feature[],
    showDelete = true,
  ): JSX.Element[] | null => {
    // initialise variable to hold features
    let features;
    if (!chosenFeatures) {
      // if theres no chosen features passed as a parameter, use features in state
      features = this.state.features;
    } else {
      // if chosen features is passed as a parameter, use it.
      features = chosenFeatures;
    }
    const { classes } = this.props;
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
                  const { features } = this.state;
                  this.setState({
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
                  this.setState((prevState) => ({
                    featureType: feature.featureType,
                    inputType: feature.inputType,
                    featureName: feature.name,
                    range: feature.value?.range ?? prevState.range,
                    number: feature.value?.number ?? prevState.number,
                    array: feature.value?.array ?? [],
                    featureIdx: i,
                    featureDesc: feature?.description ?? "",
                  }));
                }}
              />
            </div>
          )}
        </li>,
      );
    });
    // return the jsx array to be rendered
    return data;
  };

  /**
   * Method to add (or update) a variant and place it into the variants array
   * saved in state.
   */
  private handleAddVariant = (): void => {
    const {
      price,
      dimensions,
      features,
      currentIdx,
      errors,
      variantIdx,
      variantName,
      instructions,
    } = this.state;
    const { updateVariants, variants } = this.props;

    // if there are errors, notify the user by setting them in state, which will be visually shown to user
    if (!dimensions) {
      return this.setState({
        errors: { ...errors, dimensions: "Please enter a dimension for your product." },
      });
    }
    // save updatedVariants into a variable so it can be easily mutated
    const updatedVariants = variants;
    // create a variable with the new variant data in it.
    const variant = {
      dimensions,
      price,
      features,
      variantName,
      instructions,
    };
    // if there is a variantIdx then the variant in that index needs to overwritten with the variant variable
    if (variantIdx !== null) {
      updatedVariants[variantIdx] = variant;
    } else {
      // if there is no variantIdx, the variant needs to be pushed into variants array
      updatedVariants.push(variant);
    }
    // reset all inputs to be empty.
    this.setState({
      variantName: "",
      instructions: "",
      dimensions: "",
      price: {
        item: 0,
        postage: 0,
      },
      featureName: "",
      inputType: "",
      featureType: "",
      range: [0, 1],
      number: 1,
      array: [],
      features: [],
      featureDesc: "",
      currentIdx: currentIdx + 1,
    });
    // update variants in parent with updateVariants function from props.
    updateVariants(updatedVariants);
  };

  /**
   * Method to render the inputs which will be used the create the parameters
   * of the variant creation, based on the inputType.
   */
  private renderType = (): JSX.Element | null => {
    // destructure relevant properties
    const {
      number,
      array,
      range,
      featureName,
      inputType,
      errors,
      featureIdx,
    } = this.state;
    const { classes } = this.props;
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
              onChange={(_e, number): void => this.setState({ number: number as number })}
              marks={marks.slice(1)}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleAddFeature}
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
              onChange={(_e, range): void => this.setState({ range: range as number[] })}
              marks={marks}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleAddFeature}
              style={{ margin: "4px 0 10px" }}
              disabled={range[0] === range[1] || range[1] < range[0]}
            >
              {featureIdx === null ? "Add Feature" : "Update Feature"}
            </Button>
          </>
        );
      case "array":
        /**
         * If the inputType is array then a chip input will be rendered, where the user
         * can add values into it. These values will normally be used to render a select
         * component (dropdown).
         */
        return (
          <>
            <ChipInput
              label={`${featureName} Choices`}
              value={array}
              onAdd={(chip): void => this.setState({ array: [...array, chip] })}
              onDelete={(chip): void => {
                const idx = array.findIndex((currentIdx) => currentIdx === chip);
                this.setState({
                  array: [...array.slice(0, idx), ...array.slice(idx + 1)],
                });
              }}
              variant="outlined"
              fullWidth
              error={!!errors.array}
              helperText={errors.array}
              classes={{
                inputRoot: classes.chipInput,
                chip: this.props.type === "Cake" ? classes.chipCake : classes.chipCreates,
              }}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleAddFeature}
              style={{ margin: "4px 0 10px" }}
              disabled={array.length === 0}
            >
              {featureIdx === null ? "Add Feature" : "Update Feature"}
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  public render(): JSX.Element {
    const {
      dimensions,
      price,
      inputType,
      featureName,
      features,
      featureType,
      variantIdx,
      variantName,
      instructions,
      featureDesc,
    } = this.state;
    const { classes, setPrice, variants, size } = this.props;

    return (
      <div style={{ margin: "10px 0", width: "100%" }}>
        <OutlinedContainer label="Variants" labelWidth={50} padding={24}>
          <Typography gutterBottom>
            Please complete all of the required fields then add the products&apos;
            customisable features for each variant.
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={7}>
              <TextField
                variant="outlined"
                label="Name (optional)"
                fullWidth
                size={size}
                value={variantName}
                onChange={(e): void => this.setState({ variantName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                variant="outlined"
                label="Dimensions"
                fullWidth
                size={size}
                value={dimensions}
                onChange={(e): void => this.setState({ dimensions: e.target.value })}
                style={{ marginBottom: 8 }}
              />
            </Grid>
          </Grid>
          <TextField
            variant="outlined"
            value={instructions}
            size={size}
            rows={3}
            rowsMax={5}
            onChange={(e): void => this.setState({ instructions: e.target.value })}
            label="Instructions (optional)"
            fullWidth
            multiline
            placeholder="Enter any instructions that may be needed to complete the purchase"
            style={{ marginBottom: 8 }}
          />

          {setPrice && (
            <Grid container spacing={1}>
              <Grid item xs={6} sm={6}>
                <FormControl fullWidth variant="outlined" size={size}>
                  <InputLabel htmlFor="item-adornment">Product Cost</InputLabel>
                  <OutlinedInput
                    id="item-adornment"
                    value={price.item}
                    type="number"
                    onChange={(e): void => {
                      this.setState({
                        price: { ...price, item: parseFloat(e.target.value) },
                      });
                    }}
                    style={{ marginBottom: 8 }}
                    startAdornment={<InputAdornment position="start">£</InputAdornment>}
                    labelWidth={90}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={6}>
                <FormControl fullWidth variant="outlined" size={size}>
                  <InputLabel htmlFor="postage-adornment">Shipping Cost</InputLabel>
                  <OutlinedInput
                    id="postage-adornment"
                    value={price.postage}
                    type="number"
                    onChange={(e): void =>
                      this.setState({
                        price: { ...price, postage: parseFloat(e.target.value) },
                      })
                    }
                    style={{ marginBottom: 8 }}
                    startAdornment={<InputAdornment position="start">£</InputAdornment>}
                    labelWidth={90}
                  />
                </FormControl>
              </Grid>
            </Grid>
          )}
          <Typography variant="subtitle2" style={{ marginBottom: 6, marginLeft: 5 }}>
            Enter the name of the customisable option and choose a value type to reveal
            the input.
          </Typography>
          <Grid container style={{ marginBottom: 8 }}>
            <Grid item xs={12} sm={4}>
              <FormControl variant="outlined" className={classes.formControl} size={size}>
                <InputLabel id="feature-type-label" variant="outlined">
                  User Action
                </InputLabel>
                <Select
                  value={featureType}
                  fullWidth
                  labelWidth={200}
                  label="User Action"
                  variant="outlined"
                  style={{
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                  onChange={(e): void => {
                    const featureType = e.target.value as FeatureType;
                    if (featureType === "images") {
                      this.setState({
                        featureName: "Images",
                      });
                    } else {
                      this.setState({ featureName: "" });
                    }
                    if (featureType === "other") {
                      this.setState({
                        inputType: "array",
                      });
                    }
                    this.setState({ featureType });
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
                InputProps={{
                  classes: {
                    notchedOutline: size === "medium" ? classes.input : "",
                  },
                }}
                fullWidth
                onChange={(e): void => this.setState({ featureName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl variant="outlined" className={classes.formControl} size={size}>
                <InputLabel id="input-type-label" variant="outlined">
                  Required Values
                </InputLabel>
                <Select
                  value={inputType}
                  fullWidth
                  labelId="input-type-label"
                  id="input-type"
                  disabled={featureName.length === 0}
                  label="Required Values"
                  variant="outlined"
                  style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                  onChange={(e): void =>
                    this.setState({ inputType: e.target.value as InputType })
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
            <Grid item xs={12}>
              <TextField
                value={featureDesc}
                label="Description (optional)"
                fullWidth
                style={{ marginTop: 8 }}
                size={size}
                placeholder="Describe the feature"
                onChange={(e): void => this.setState({ featureDesc: e.target.value })}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <div className={classes.typeContainer}>{this.renderType()}</div>
          {features.length > 0 && (
            <ul style={{ margin: 0 }}>{this.renderCurrentFeatures()}</ul>
          )}
          {dimensions.length > 0 && (
            <div className={classes.buttonContainer}>
              {variantIdx !== null && (
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ margin: "20px 4px 0" }}
                  onClick={(): void =>
                    this.setState({
                      variantIdx: null,
                      dimensions: "",
                      featureType: "",
                      featureName: "",
                      inputType: "",
                      features: [],
                    })
                  }
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                style={{ margin: "20px 4px 0" }}
                onClick={this.handleAddVariant}
              >
                {variantIdx !== null ? "Update Variant" : "Save Variant"}
              </Button>
            </div>
          )}
          <Grid container spacing={1}>
            {variants?.length > 0 &&
              variants.map((variant, i) => {
                const {
                  dimensions,
                  price,
                  features,
                  variantName,
                  instructions,
                } = variant;
                return (
                  <Grid item xs={12} sm={6} key={i}>
                    <div
                      style={{
                        padding: 12,
                        border: `1px solid ${COLORS.BorderGray}`,
                        borderRadius: 5,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography className={classes.variantTitle}>
                          {variantName || `Variant ${i + 1}.`}
                        </Typography>
                        <Typography>
                          <span className={classes.name}>Dimensions</span>:{" "}
                          <em>{dimensions}</em>
                        </Typography>
                        {price.item > 0 && (
                          <Typography>
                            <span className={classes.name}>Price</span>:{" "}
                            <em>
                              £{price.item.toFixed(2)} + £{price.postage.toFixed(2)} P&P.
                            </em>
                          </Typography>
                        )}
                        {instructions && (
                          <Typography>
                            Instructions: <em>{instructions}</em>
                          </Typography>
                        )}
                      </div>
                      {features.length > 0 && (
                        <>
                          <Typography style={{ fontWeight: "bold" }}>
                            Features:
                          </Typography>
                          <ul style={{ margin: 0 }}>
                            {this.renderCurrentFeatures(features, false)}
                          </ul>
                        </>
                      )}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <IconButton
                          color="secondary"
                          onClick={(): void => {
                            const { updateVariants } = this.props;
                            let updatedVariants: Variant[];
                            if (variants.length === 0) {
                              updatedVariants = [];
                            } else {
                              updatedVariants = [
                                ...variants.slice(0, i),
                                ...variants.slice(i + 1),
                              ];
                            }
                            updateVariants(updatedVariants);
                          }}
                        >
                          <Tooltip title="Delete Variant">
                            <DeleteRounded />
                          </Tooltip>
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={(): void => {
                            this.setState({ ...variant, variantIdx: i });
                          }}
                        >
                          <Tooltip title="Edit the current variant">
                            <EditRounded />
                          </Tooltip>
                        </IconButton>
                        <IconButton
                          onClick={(): void => {
                            this.setState({
                              dimensions,
                              price,
                              features,
                              variantName,
                              instructions,
                              variantIdx: null,
                            });
                          }}
                        >
                          <Tooltip title="Copy to new variant">
                            <FileCopyRounded />
                          </Tooltip>
                        </IconButton>
                      </div>
                    </div>
                  </Grid>
                );
              })}
          </Grid>
        </OutlinedContainer>
      </div>
    );
  }
}

export default withStyles(styles)(Variants);
