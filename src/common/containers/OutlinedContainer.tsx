import React from "react";
import { makeStyles } from "@material-ui/core";
import { COLORS } from "../../themes";

interface OutlinedProps {
  label: string;
  labelWidth: number;
  padding: number;
  error?: boolean;
  disabled?: boolean;
}

/**
 * Component which wraps content in the same style of material-ui's outlined inputs
 * (OutlinedInput component).
 * @param {string} label - label for the component
 * @param {number} labelWidth - the space for the label to go into
 * @param {JSX.Element} children - content for the component
 * @param {boolean} error - boolean which changes visual appearance of component if true
 * @param {number} padding - the amount of padding to add to the component
 * @param {boolean} disabled - boolean which disables some/all of the component if true.
 */
const OutlinedContainer: React.SFC<OutlinedProps> = ({
  label,
  labelWidth,
  children,
  error = false,
  padding = 20,
  disabled = false,
}): JSX.Element => {
  // create styles for the component
  const useStyles = makeStyles({
    container: {
      borderRadius: 4,
      width: "100%",
      boxSizing: "border-box",
      "&:hover": {
        border: !disabled && "1px solid black !important",
      },
    },
    label: {
      fontSize: "11px",
      background: "#fff",
      fontWeight: 300,
      padding: "0 5px",
    },
    content: {
      minHeight: 45,
      margin: "auto",
    },
  });

  // use the styles in the component
  const classes = useStyles();

  return (
    <div
      className={classes.container}
      style={{
        border: error
          ? `1px solid ${COLORS.ErrorRed}`
          : disabled
          ? `1px solid ${COLORS.DisabledGray}`
          : `1px solid ${COLORS.BorderGray}`,
        padding,
      }}
    >
      <p
        className={classes.label}
        style={{
          width: labelWidth,
          color: disabled
            ? COLORS.DisabledGray // if disabled
            : error
            ? COLORS.ErrorRed // if not disabled and error
            : COLORS.TextGray, // not disabled and no error
          marginTop: -8 - padding,
          marginLeft: 10 - padding,
          marginBottom: padding - 8,
        }}
      >
        {label}
      </p>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default OutlinedContainer;
