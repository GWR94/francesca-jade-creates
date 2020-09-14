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
  imageLabel: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  uploadedImageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 400,
  },
  previewImage: {
    marginBottom: 8,
    width: 220,
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
  chip: {
    background: COLORS.DarkPink,
    "&:hover": {
      background: COLORS.Pink,
    },
    "&:focus": {
      background: COLORS.Pink,
    },
  },
  accordionRoot: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
  formControl: {
    margin: 8,
    minWidth: 120,
  },
});
