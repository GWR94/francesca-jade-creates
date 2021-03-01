import { Grid, Typography, IconButton, Tooltip, makeStyles } from "@material-ui/core";
import { DeleteRounded, EditRounded, FileCopyRounded } from "@material-ui/icons";
import React from "react";
import { COLORS } from "../../../themes";
import { getReadableStringFromArray } from "../../../utils";
import { Feature, FeatureType, Variant, VariantsState } from "../interfaces/Variants.i";
import styles from "../styles/variants.style";

interface VariantCardProps {
  variant: Variant;
  variants: Variant[];
  i: number;
  updateVariants: (variants: Variant[]) => void;
  updateVariantData: (state: Partial<VariantsState>) => void;
  currentFeatures: Feature[];
}

const VariantCard: React.FC<VariantCardProps> = ({
  variant,
  variants,
  i,
  updateVariants,
  currentFeatures,
  updateVariantData,
}) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  /**
   * Method to render an array of JSX which will contain unordered list, containing each
   * individual feature, along with the values that are set.
   * @param chosenFeatures - optional array of features which will be used if present
   * @param showDelete - boolean value to determine if the delete icon should be shown
   */
  const renderCurrentFeatures = (chosenFeatures?: Feature[]): JSX.Element[] | null => {
    // initialise variable to hold features
    let features: Feature[];
    if (!chosenFeatures) {
      // if theres no chosen features passed as a parameter, use features in state
      features = currentFeatures;
    } else {
      // if chosen features is passed as a parameter, use it.
      features = chosenFeatures;
    }
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
        </li>,
      );
    });
    // return the jsx array to be rendered
    return data;
  };

  const { dimensions, price, features, variantName, instructions } = variant;
  return (
    <Grid item xs={12} sm={6}>
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
            <span className={classes.name}>Dimensions</span>: <em>{dimensions}</em>
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
            <Typography
              style={{
                fontWeight: "bold",
              }}
            >
              Features:
            </Typography>
            <ul
              style={{
                margin: 0,
              }}
            >
              {renderCurrentFeatures(features)}
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
              let updatedVariants: Variant[];
              if (variants?.length === 0) {
                updatedVariants = [];
              } else {
                updatedVariants = [...variants.slice(0, i), ...variants.slice(i + 1)];
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
              updateVariantData({
                ...variant,
                variantIdx: i,
              });
            }}
          >
            <Tooltip title="Edit the current variant">
              <EditRounded />
            </Tooltip>
          </IconButton>
          <IconButton
            onClick={(): void => {
              const state = {
                dimensions,
                price,
                features,
                variantName,
                instructions,
                variantIdx: null,
              };
              updateVariantData(state);
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
};

export default VariantCard;
