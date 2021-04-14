import { createStyles } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { COLORS, FONTS } from "../../../themes";

const breakpoints = createBreakpoints({});

export default createStyles({
  heading: {
    fontSize: "1rem",
    flexBasis: "47%",
    flexShrink: 0,
    paddingRight: 10,
    [breakpoints.down("md")]: {
      fontSize: "0.9rem",
    },
    [breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
  },
  accordion: {
    width: "100%",
    boxSizing: "border-box",
  },
  secondaryHeading: {
    fontSize: "0.85rem",
    color: COLORS.TextGray,
  },
  editSpan: {
    fontStyle: "italic",
    fontFamily: FONTS.Title,
    paddingRight: 4,
    color: COLORS.InfoBlue,
    cursor: "pointer",
    [breakpoints.down("md")]: {
      fontSize: "0.9rem",
    },
    [breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
  },
  deleteSpan: {
    fontStyle: "italic",
    fontFamily: FONTS.Title,
    paddingLeft: 4,
    color: COLORS.ErrorRed,
    cursor: "pointer",
    [breakpoints.down("md")]: {
      fontSize: "0.9rem",
    },
    [breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
  },
  variantsInputContainer: {
    width: "100%",
    margin: "8px 0",
  },
  buttonContainer: {
    width: "100%",
    display: "inline-flex",
    justifyContent: "space-evenly",
  },
  accordionRoot: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    boxSizing: "border-box",
  },
  formControl: {
    display: "inline-flex",
    justifyContent: "space-evenly",
    width: "100%",
  },
  button: {
    margin: "0 5px",
  },
  stepButtonContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px 0",
  },
  statusTab: {
    fontStyle: "italic",
  },
});
