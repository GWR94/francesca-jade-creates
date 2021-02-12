import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import _ from "underscore";
import { v4 as uuidv4 } from "uuid";
import { Feature } from "../interfaces/Variants.i";
import styles from "../../accounts/styles/viewVariants.style";
import { ViewVariantsProps, ViewVariantsState } from "../interfaces/ViewVariants.i";

/**
 * Functional component to view all of the variants of the chosen product, and all
 * of their custom options that the user is allowed to customise for it.
 * @param variants - An array of variants that exist on the chosen product.
 */
const ViewVariants = ({
  variants,
  customOptions,
  type,
}: ViewVariantsProps): JSX.Element => {
  // execute makeStyles function with external styles, and store resulting function in variable
  const useStyles = makeStyles(styles);
  // execute useStyles function and assign to variable to use throughout component
  const classes = useStyles();

  // create the initial state for the component
  const [state, setState] = useState<ViewVariantsState>({
    currentVariant: variants.length === 1 ? variants[0] : null,
    variantIdx: "",
    userShouldPickVariant: false,
  });

  useEffect((): void => {
    let customOptions: Feature[] = [];
    variants.forEach((variant) => {
      customOptions = [...customOptions, ...variant.features];
    });
    const userShouldPickVariant = _.uniq(customOptions).length > 1;
    setState({
      ...state,
      userShouldPickVariant,
      currentVariant: variants[0],
      variantIdx: "0",
    });
  }, []);

  const desktop = useMediaQuery("('min-width: 600px')");
  const { currentVariant, variantIdx, userShouldPickVariant } = state;
  return (
    <div className={classes.variantContainer}>
      <Typography variant="h6" style={{ textAlign: "center" }}>
        Product Description
      </Typography>
      {userShouldPickVariant && variants.length > 1 && (
        <div>
          <Typography variant="subtitle2">
            Please select a variant to view the product details.
          </Typography>
          <FormControl
            variant="outlined"
            size={desktop ? "medium" : "small"}
            style={{ width: "100%" }}
          >
            <InputLabel variant="outlined">Select Variant</InputLabel>
            <Select
              onChange={(e): void => {
                const variantIdx = e.target.value as string;
                const currentVariant = variants[parseInt(variantIdx)];
                setState({
                  ...state,
                  currentVariant,
                  variantIdx,
                });
              }}
              fullWidth
              variant="outlined"
              label="Select Variant"
              value={variantIdx}
            >
              <MenuItem value="">
                <em>Pick a Variant</em>
              </MenuItem>
              {variants.map((variant, i) => (
                <MenuItem value={i} key={i}>
                  {variant.variantName || variant.dimensions}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}
      {currentVariant !== null && type === "Creates" && (
        <div style={{ width: "100%", height: variants.length === 1 ? "100%" : "auto" }}>
          <div key={uuidv4()}>
            {variants.length > 1 && (
              <Typography className={classes.variantTitle}>
                {currentVariant.variantName || `Variant ${variantIdx + 1}`}
              </Typography>
            )}
            {!!currentVariant.dimensions && (
              <div className={classes.featureContainer}>
                <Typography className={classes.title}>Dimensions</Typography>
                <Typography className={classes.info}>
                  {currentVariant.dimensions}
                </Typography>
              </div>
            )}
            <div className={classes.featureContainer}>
              <Typography className={classes.title}>Cost</Typography>
              <div className={classes.iconTextContainer}>
                <i className={`fas fa-shopping-basket ${classes.icon}`} />
                <Typography className={classes.info}>
                  £{currentVariant.price.item.toFixed(2)}
                </Typography>
              </div>
              <div className={classes.iconTextContainer}>
                <i className={`fas fa-truck ${classes.icon}`} />
                <Typography className={classes.info}>
                  £{currentVariant.price.postage.toFixed(2)}
                </Typography>
              </div>
            </div>
            {currentVariant.features.length > 0 && (
              <div style={{ marginBottom: 6 }}>
                <Typography className={classes.title}>Customisable Features</Typography>
                <ul style={{ margin: 0, paddingLeft: 33 }}>
                  {currentVariant.features.map((feature) => {
                    return <li style={{ fontStyle: "italic" }}>{feature.name}</li>;
                  })}
                </ul>
              </div>
            )}
            {customOptions.length > 0 && (
              <>
                <Typography className={classes.title}>
                  {type === "Creates" ? "Color Scheme" : "Cake Features"}
                </Typography>
                <ul style={{ margin: 0, paddingLeft: 33 }}>
                  {customOptions.map((option) => {
                    return <li style={{ fontStyle: "italic" }}>{option}</li>;
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default ViewVariants;
