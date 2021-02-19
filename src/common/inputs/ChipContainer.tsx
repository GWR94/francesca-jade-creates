import React from "react";
import { Chip, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { COLORS, breakpoints } from "../../themes";

interface ChipContainerProps {
  tags: string[];
  type: "Cake" | "Creates";
  openLink?: boolean;
}

/**
 * A component which follows material-ui's outlined input where you can add tags
 * to an individual product.
 * @param tags - Array of string containing the labels for each tag
 * @param type - The type of product which the tags are for.
 */
const ChipContainer: React.FC<ChipContainerProps> = ({
  tags,
  type,
  openLink = false,
}): JSX.Element => {
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
      color: "#fff",
      padding: "8px 12px",
      fontSize: "0.9rem",
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
  const classes = useStyles();
  const history = useHistory();
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
            onClick={(): void => {
              if (openLink) history.push(`/themes?current=${tag}`);
            }}
            tabIndex={0}
            role="button"
            color={type === "Cake" ? "secondary" : "primary"}
            style={{
              color: "#fff",
              alignItems: "center",
              cursor: openLink ? "pointer" : "cursor",
            }}
          />
        ),
      )}
    </div>
  );
};

export default ChipContainer;
