import React from "react";
import { Chip, ThemeProvider, createMuiTheme, makeStyles } from "@material-ui/core";

interface ChipContainerProps {
  tags: string[];
  type: "Cake" | "Creates";
}

// create theme to style the tags
const chipTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#9370f6",
    },
    secondary: {
      main: "#ff80f7",
    },
  },
});

// create styles for component
const useStyles = makeStyles({
  container: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100%",
  },
});

/**
 * A component which follows material-ui's outlined input where you can add tags
 * to an individual product.
 * @param {string[]} tags - Array of string containing the labels for each tag
 * @param {"Cake" | "Creates"} type - The type of product which the tags are for.
 */
const ChipContainer: React.SFC<ChipContainerProps> = ({ tags, type }): JSX.Element => {
  // use styles
  const classes = useStyles();
  return (
    <div className={classes.container}>
      {/* The theme changes the tags colour based on which type the product is */}
      <ThemeProvider theme={chipTheme}>
        {/* map the tags array into each individual chip component */}
        {tags.map(
          (tag, i): JSX.Element => (
            <Chip
              key={i}
              className="tags__tag"
              label={tag}
              size="small"
              color={type === "Cake" ? "secondary" : "primary"}
              style={{ color: "#fff", borderRadius: "3px", alignItems: "center" }}
            />
          ),
        )}
      </ThemeProvider>
    </div>
  );
};

export default ChipContainer;
