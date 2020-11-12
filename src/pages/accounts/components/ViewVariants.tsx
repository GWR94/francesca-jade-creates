import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import { Variant } from "../interfaces/Variants.i";
import styles from "../styles/viewVariants.style";

interface ViewVariantsProps {
  variants: Variant[];
}

const ViewVariants = ({ variants }: ViewVariantsProps): JSX.Element | null => {
  if (!variants) return null;
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  return (
    <>
      {variants.some((variant) => variant.features.length > 0) && (
        <Typography variant="h5" style={{ textAlign: "center" }}>
          Variants
        </Typography>
      )}
      <div className={classes.variantContainer}>
        {variants.map((variant, i) => {
          const { variantName, dimensions, price } = variant;
          return (
            <div key={uuidv4()} className={classes.variant}>
              <Typography className={classes.variantTitle}>
                {variantName || `Variant ${i + 1}`}
              </Typography>
              <Typography>
                Dimensions: <span className={classes.info}>{dimensions}</span>
              </Typography>
              <Typography>
                Cost:{" "}
                <span className={classes.info}>
                  £{price.item.toFixed(2)} + £{price.postage.toFixed(2)} P&P
                </span>
              </Typography>
            </div>
          );
        })}
        {variants.some((variant) => variant.features.length > 0) && (
          <>
            {/* <div className={classes.break} /> */}
            <div className={classes.customFeatures}>
              <Typography gutterBottom className={classes.variantTitle}>
                Customisable Features
              </Typography>
              <ul style={{ margin: 0 }}>
                {variants[0]?.features.map((feature) => {
                  return <li key={uuidv4()}>{feature.name}</li>;
                })}
              </ul>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default ViewVariants;
