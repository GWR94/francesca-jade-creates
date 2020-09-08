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

class Variants extends Component<VariantsProps, VariantsState> {
  public readonly state: VariantsState = {
    dimensions: "",
    price: {
      item: 0,
      postage: 0,
    },
    name: "",
    inputType: "",
    featureType: "",
    range: [0, 1],
    number: 1,
    array: [],
    features: [],
    current: 1,
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
    isEditing: null,
    instructions: "",
  };

  private marks = [
    {
      value: 0,
      label: 0,
    },
    {
      value: 2,
      label: 2,
    },
    {
      value: 4,
      label: 4,
    },
    {
      value: 6,
      label: 6,
    },
    {
      value: 8,
      label: 8,
    },
    {
      value: 10,
      label: 10,
    },
    {
      value: 12,
      label: 12,
    },
    {
      value: 14,
      label: 14,
    },
    {
      value: 16,
      label: 16,
    },
    {
      value: 18,
      label: 18,
    },
    {
      value: 20,
      label: 20,
    },
  ];

  private handleAddFeature = (): void => {
    const { inputType, featureType, number, features, array, range, name } = this.state;
    let feature;
    switch (inputType) {
      case "number":
        feature = { name, value: { number }, featureType, inputType };
        break;
      case "array":
        feature = { name, value: { array }, featureType, inputType };
        break;
      case "range":
        feature = { name, value: { range }, featureType, inputType };
        break;
      default:
        return;
    }
    let match = false;
    features.forEach((feature) => {
      if (feature.name === name) match = true;
    });
    if (!match) {
      this.setState({
        features: [...features, feature],
        name: "",
        number: 1,
        range: [0, 1],
        array: [],
        inputType: "",
        featureType: "",
      });
    }
  };

  private renderCurrentFeatures = (chosenFeatures?: Feature[]): JSX.Element[] | null => {
    let features;
    if (!chosenFeatures) {
      features = this.state.features;
    } else {
      features = chosenFeatures;
    }
    const { classes } = this.props;
    if (!features.length) return null;
    const data: JSX.Element[] = [];
    features.forEach((feature, i): void => {
      const { name, featureType, inputType } = feature;
      let description;
      switch (inputType) {
        case "range": {
          const value = feature.value.range as number[];
          description = `Between ${value[0]} and ${value[1]} -- ${featureType}`;
          break;
        }
        case "number": {
          const value = feature.value.number as number;
          description = `${value} only -- ${featureType}`;
          break;
        }
        case "array": {
          const value = feature.value.array as string[];
          description = `Multiple choice: ${value.join(", ")}`;
          break;
        }
        default:
          return;
      }
      data.push(
        <li key={i}>
          {name} - {description} (
          <i
            role="button"
            tabIndex={0}
            className={`fas fa-times ${classes.removeIcon}`}
            onClick={(): void => {
              const { features } = this.state;
              this.setState({
                features: [...features.slice(0, i), ...features.slice(i + 1)],
              });
            }}
            style={{ cursor: "pointer" }}
          />
          )
        </li>,
      );
    });
    return data;
  };

  private handleAddVariant = (): void => {
    const {
      price,
      dimensions,
      features,
      current,
      errors,
      isEditing,
      variantName,
      instructions,
    } = this.state;
    const { updateVariants, variants } = this.props;

    if (!dimensions) {
      return this.setState({
        errors: { ...errors, dimensions: "Please enter a dimension for your product." },
      });
    }
    const updatedVariants = [...variants];
    if (isEditing !== null) {
      updatedVariants[isEditing] = {
        dimensions,
        price,
        features,
        variantName,
        instructions,
      };
    } else {
      updatedVariants.push({
        dimensions,
        price,
        features,
        variantName,
        instructions,
      });
    }
    this.setState({
      variantName: "",
      instructions: "",
      dimensions: "",
      price: {
        item: 0,
        postage: 0,
      },
      name: "",
      inputType: "",
      featureType: "",
      range: [0, 1],
      number: 1,
      array: [],
      features: [],
      current: current + 1,
    });
    updateVariants(updatedVariants);
  };

  private renderType = (): JSX.Element | null => {
    const { number, array, range, name, inputType, errors, isEditing } = this.state;
    const { classes } = this.props;
    switch (inputType) {
      case "number":
        return (
          <>
            <Typography id="range-slider" gutterBottom style={{ textAlign: "center" }}>
              Number of {name}
            </Typography>
            <Slider
              value={number}
              step={1}
              min={1}
              max={20}
              valueLabelDisplay="auto"
              onChange={(_e, number): void => this.setState({ number: number as number })}
              aria-labelledby="range-slider"
              marks={this.marks.slice(1)}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleAddFeature}
              style={{ margin: "10px 0" }}
            >
              Add Feature
            </Button>
          </>
        );
      case "range":
        return (
          <>
            <Typography id="range-slider" gutterBottom>
              Range of {name}
            </Typography>
            <Slider
              value={range}
              step={1}
              min={0}
              max={20}
              valueLabelDisplay="auto"
              onChange={(_e, range): void => this.setState({ range: range as number[] })}
              aria-labelledby="range-slider"
              marks={this.marks}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleAddFeature}
              style={{ margin: "10px 0" }}
            >
              Add Feature
            </Button>
          </>
        );
      case "array":
        return (
          <>
            <ChipInput
              label={`${name} Choices`}
              value={array}
              onAdd={(chip): void => this.setState({ array: [...array, chip] })}
              onDelete={(chip): void => {
                const idx = array.findIndex((current) => current === chip);
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
              style={{ marginBottom: 10 }}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleAddFeature}
              style={{ margin: "10px 0" }}
            >
              Add Feature
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
      name,
      features,
      featureType,
      isEditing,
      variantName,
      instructions,
    } = this.state;
    const { classes, setPrice, variants } = this.props;

    return (
      <OutlinedContainer label="Variants" labelWidth={50} padding={24}>
        <Typography gutterBottom>
          Complete all of the required fields then add the products&apos; customisable
          features for each variant.
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={7}>
            <TextField
              variant="outlined"
              label="Name (optional)"
              fullWidth
              value={variantName}
              onChange={(e): void => this.setState({ variantName: e.target.value })}
              style={{ marginBottom: 8 }}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              variant="outlined"
              label="Dimensions"
              fullWidth
              value={dimensions}
              onChange={(e): void => this.setState({ dimensions: e.target.value })}
              style={{ marginBottom: 8 }}
            />
          </Grid>
        </Grid>
        <TextField
          variant="outlined"
          value={instructions}
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
              <FormControl fullWidth variant="outlined">
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
              <FormControl fullWidth variant="outlined">
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
          Enter the name of the customisable option and choose a value type to reveal the
          input.
        </Typography>
        <Grid container style={{ marginBottom: 8 }}>
          <Grid item xs={6} sm={4}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="feature-type-label">User Action</InputLabel>
              <Select
                value={featureType}
                fullWidth
                labelId="feature-type-label"
                id="feature-type"
                label="Feature Type"
                variant="outlined"
                style={{
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}
                onChange={(e): void =>
                  this.setState({ featureType: e.target.value as FeatureType })
                }
              >
                <MenuItem value="">
                  <em>Pick a Value</em>
                </MenuItem>
                <MenuItem value="images">User Uploads Image</MenuItem>
                <MenuItem value="text">User Inputs Text</MenuItem>
                <MenuItem value="dropdown">User Picks From Choice</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              variant="outlined"
              label="Feature Name"
              value={name}
              InputProps={{
                classes: {
                  notchedOutline: classes.input,
                },
              }}
              fullWidth
              onChange={(e): void => this.setState({ name: e.target.value })}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="input-type-label">Required Values</InputLabel>
              <Select
                value={inputType}
                fullWidth
                labelId="input-type-label"
                id="input-type"
                disabled={name.length === 0}
                label="Feature Type"
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
                <MenuItem value="array">Multiple Choice</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <div className={classes.typeContainer}>{this.renderType()}</div>
        {features.length > 0 && (
          <ul style={{ margin: 0 }}>{this.renderCurrentFeatures()}</ul>
        )}
        {features.length > 0 && dimensions.length > 0 && (
          <div className={classes.buttonContainer}>
            {isEditing !== null && (
              <Button
                variant="contained"
                color="secondary"
                style={{ margin: "20px 4px 0" }}
                onClick={(): void =>
                  this.setState({
                    isEditing: null,
                    dimensions: "",
                    featureType: "",
                    name: "",
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
              {isEditing !== null ? "Update Variant" : "Save Variant"}
            </Button>
          </div>
        )}
        <Grid container spacing={1}>
          {variants?.length > 0 &&
            variants.map((variant, i) => {
              const { dimensions, price, features, variantName, instructions } = variant;
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
                      <Typography style={{ fontWeight: "bold" }}>
                        {variantName || `Variant ${i + 1}.`}
                      </Typography>
                      <Typography>
                        Dimensions: <em>{dimensions}</em>
                      </Typography>
                      {price.item > 0 && (
                        <Typography>
                          Price:{" "}
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
                    <Typography style={{ fontWeight: "bold" }}>Features:</Typography>
                    <ul style={{ margin: 0 }}>{this.renderCurrentFeatures(features)}</ul>
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
                          console.log(variants);
                        }}
                      >
                        <Tooltip title="Delete Variant">
                          <DeleteRounded />
                        </Tooltip>
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={(): void => {
                          this.setState({ ...variant, isEditing: i });
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
    );
  }
}

export default withStyles(styles)(Variants);
