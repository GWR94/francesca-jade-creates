import React from "react";
import { Chip, ThemeProvider, createMuiTheme } from "@material-ui/core";

interface Props {
  tags: string[];
  type: "Cake" | "Creates";
}

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

const TagsInput = ({ tags, type }): JSX.Element => (
  <div className="tags__container">
    <ThemeProvider theme={chipTheme}>
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

export default TagsInput;
