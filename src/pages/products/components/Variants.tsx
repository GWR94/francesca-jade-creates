import React, { Component } from "react";
import {
  Typography,
  TextField,
  Grid,
  withStyles,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import styles from "../styles/variants.style";
import {
  Feature,
  UpdateVariantProps,
  Variant,
  VariantsProps,
  VariantsState,
} from "../interfaces/Variants.i";
import { openSnackbar } from "../../../utils/Notifier";
import FeatureInput from "./FeatureInput";
import VariantCard from "./VariantCard";
import { COLORS, INTENT } from "../../../themes";

/**
 * TODO
 * [ ] Add "there's unsaved information" popup when saving to avoid lost data.
 * ![ ] Check errors
 */

const initialState: VariantsState = {
  dimensions: "",
  price: {
    item: 0,
    postage: 0,
  },
  currentIdx: 1,
  variantName: "",
  errors: {
    dimensions: "",
    priceItem: "",
    priceShipping: "",
    variantName: "",
    instructions: "",
  },
  variantIdx: null,
  instructions: "",
  featureIdx: null,
  featureDesc: "",
  features: [],
};

/**
 * Class component which renders a set of inputs which allow an admin user to
 * create a variant of a product so a customer can customise and fine-tune their
 * order.
 */
class Variants extends Component<VariantsProps, VariantsState> {
  public readonly state: VariantsState = initialState;

  /**
   * Method to add (or update) a variant and place it into the variants array
   * saved in state.
   */
  private handleAddVariant = (features?: Feature[]): void => {
    const {
      price,
      dimensions,
      currentIdx,
      errors,
      variantIdx,
      variantName,
      instructions,
    } = this.state;
    const { updateVariants, variants } = this.props;
    const updatedErrors: { [key: string]: string } = {};
    let anyError = false;
    // if there are errors, notify the user by setting them in state, which will be visually shown to user
    if (variantName.length > 0 && variantName.length < 4) {
      anyError = true;
      updatedErrors.variantName = "Please enter a descriptive name (min 4 chars).";
    }
    if (!dimensions?.length) {
      anyError = true;
      updatedErrors.dimensions = "Please enter a dimension for your product.";
    }
    if (price.item <= 0) {
      anyError = true;
      updatedErrors.priceItem = "Please enter a valid product cost.";
    }
    if (price.postage <= 0) {
      anyError = true;
      updatedErrors.priceShipping = "Please enter a valid shipping cost.";
    }
    if (instructions.length > 0 && instructions.length < 15) {
      anyError = true;
      updatedErrors.instructions =
        "Please enter descriptive instructions (min 15 chars).";
    }
    if (anyError) {
      this.setState({ errors: { ...errors, ...updatedErrors } });
      return openSnackbar({
        severity: INTENT.Danger,
        message: "Please fix all of the errors before continuing.",
      });
    }

    // save updatedVariants into a variable so it can be easily mutated
    const updatedVariants = variants;
    // create a variable with the new variant data in it.
    const variant: Variant = {
      dimensions,
      price,
      features: features ?? [],
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
      currentIdx: currentIdx + 1,
    });
    // update variants in parent with updateVariants function from props.
    updateVariants(updatedVariants);
  };

  public render(): JSX.Element {
    const {
      dimensions,
      price,
      variantIdx,
      variantName,
      instructions,
      errors,
      features,
    } = this.state;
    const { classes, setPrice, variants, size, type, updateVariants } = this.props;

    return (
      <div
        style={{
          margin: "10px 0",
          width: "100%",
          border: `1px solid ${COLORS.BorderGray}`,
          borderRadius: 5,
          padding: 20,
          boxSizing: "border-box",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Create Variants
        </Typography>
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
              error={!!errors.variantName}
              helperText={errors.variantName}
              onChange={(e): void =>
                this.setState({
                  variantName: e.target.value,
                  errors: { ...errors, variantName: "" },
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              variant="outlined"
              label="Dimensions"
              fullWidth
              size={size}
              value={dimensions}
              error={!!errors.dimensions}
              helperText={errors.dimensions}
              onChange={(e): void =>
                this.setState({
                  dimensions: e.target.value,
                  errors: { ...errors, dimensions: "" },
                })
              }
              style={{ marginBottom: 8 }}
            />
          </Grid>
        </Grid>
        <TextField
          variant="outlined"
          value={instructions}
          size={size}
          rows={3}
          error={!!errors.instructions}
          helperText={errors.instructions}
          rowsMax={5}
          onChange={(e): void =>
            this.setState({
              instructions: e.target.value,
              errors: { ...errors, instructions: "" },
            })
          }
          label="Instructions (optional)"
          fullWidth
          multiline
          placeholder="Enter any instructions that may be needed to complete the purchase"
          style={{ marginBottom: 8 }}
        />

        {setPrice && (
          <Grid container spacing={1}>
            <Grid item xs={6} sm={6}>
              <FormControl
                error={!!errors.priceItem}
                fullWidth
                variant="outlined"
                size={size}
              >
                <InputLabel error={!!errors.priceItem} htmlFor="item-adornment">
                  Product Cost
                </InputLabel>
                <OutlinedInput
                  id="item-adornment"
                  value={price.item}
                  type="number"
                  onChange={(e): void => {
                    this.setState({
                      price: { ...price, item: parseFloat(e.target.value) },
                      errors: { ...errors, priceItem: "" },
                    });
                  }}
                  error={!!errors.priceItem}
                  style={{ marginBottom: 8 }}
                  startAdornment={<InputAdornment position="start">£</InputAdornment>}
                  labelWidth={90}
                />
              </FormControl>
              {errors?.priceItem?.length > 0 && (
                <Typography className={classes.error}>{errors.priceItem}</Typography>
              )}
            </Grid>
            <Grid item xs={6} sm={6}>
              <FormControl
                error={!!errors.priceItem}
                fullWidth
                variant="outlined"
                size={size}
              >
                <InputLabel htmlFor="postage-adornment">Shipping Cost</InputLabel>
                <OutlinedInput
                  id="postage-adornment"
                  value={price.postage}
                  type="number"
                  error={!!errors.priceShipping}
                  onChange={(e): void =>
                    this.setState({
                      price: { ...price, postage: parseFloat(e.target.value) },
                      errors: { ...errors, priceShipping: "" },
                    })
                  }
                  style={{ marginBottom: 8 }}
                  startAdornment={<InputAdornment position="start">£</InputAdornment>}
                  labelWidth={90}
                />
              </FormControl>
              {errors.priceShipping?.length > 0 && (
                <Typography className={classes.error}>{errors.priceShipping}</Typography>
              )}
            </Grid>
          </Grid>
        )}
        <FeatureInput
          size={size}
          type={type}
          variantIdx={variantIdx}
          handleAddVariant={(features?): void => this.handleAddVariant(features)}
          variantFeatures={features}
          handleCancel={(): void =>
            this.setState({
              variantIdx: null,
              dimensions: "",
              instructions: "",
              price: {
                item: 0,
                postage: 0,
              },
            })
          }
        />
        <Grid container spacing={1}>
          {variants?.length > 0 &&
            variants.map((variant: Variant, i: number) => (
              <VariantCard
                variant={variant}
                i={i}
                key={i}
                variants={variants}
                updateVariants={updateVariants}
                currentFeatures={variant.features}
                updateVariantData={(data: UpdateVariantProps): void => {
                  this.setState({ ...data });
                }}
              />
            ))}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Variants);
