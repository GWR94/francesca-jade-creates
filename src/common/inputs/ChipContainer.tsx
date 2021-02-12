import React from "react";
import { Chip, ThemeProvider, makeStyles } from "@material-ui/core";
import { COLORS, breakpoints } from "../../themes";

interface ChipContainerProps {
  tags: string[];
  type: "Cake" | "Creates";
}

/**
 * TODO
 * [ ] Create chip input component and remove mui-chip-input library
 */

/**
 * A component which follows material-ui's outlined input where you can add tags
 * to an individual product.
 * @param tags - Array of string containing the labels for each tag
 * @param type - The type of product which the tags are for.
 */
const ChipContainer: React.FC<ChipContainerProps> = ({ tags, type }): JSX.Element => {
  // create styles for component
  const useStyles = makeStyles({
    container: {
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
      width: "100%",
      marginTop: 10,
    },
    tag: {
      cursor: "pointer",
      color: "#fff",
      borderRadius: 3,
      padding: "8px 12px",
      fontSize: "1rem",
      margin: "4px",
      [breakpoints.down("xs")]: {
        padding: "4px 8px",
        fontSize: "0.8rem",
      },
    },
    createsTag: {
      background: COLORS.DarkGrey,
      "&:hover": {
        background: COLORS.Gray,
      },
    },
    cakesTag: {
      background: COLORS.DarkPink,
      "&:hover": {
        background: COLORS.Pink,
      },
    },
  });
  // use styles
  const classes = useStyles();
  return (
    <div className={classes.container}>
      {/* The theme changes the tags colour based on which type the product is */}
      {/* map the tags array into each individual chip component */}
      {tags.map(
        (tag, i): JSX.Element => (
          <Chip
            key={i}
            className={`${classes.tag} ${
              type === "Cake" ? classes.cakesTag : classes.createsTag
            }`}
            label={tag}
            size="small"
            color={type === "Cake" ? "secondary" : "primary"}
            style={{
              color: "#fff",
              borderRadius: "3px",
              alignItems: "center",
            }}
          />
        ),
      )}
    </div>
  );
};

export default ChipContainer;
