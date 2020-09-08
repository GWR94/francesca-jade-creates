import { createStyles } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { COLORS, FONTS } from "../../../themes";

const breakpoints = createBreakpoints({});

export default createStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    border: `1px solid ${COLORS.AltBorderGray}`,
    WebkitBorderRadius: 8,
    MozBorderRadius: 8,
    borderRadius: 8,
    marginBottom: 12,
    width: "100%",
    boxSizing: "border-box",
    [breakpoints.down("md")]: {
      padding: "12px 8px",
    },
    [breakpoints.up("md")]: {
      padding: "24px 16px",
    },
  },
  title: {
    [breakpoints.only("xs")]: {
      fontSize: "1rem",
    },
    [breakpoints.only("sm")]: {
      fontSize: "1.1rem",
    },
    [breakpoints.up("md")]: {
      fontSize: "1.3rem",
    },
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 4,
  },
  tagline: {
    [breakpoints.only("xs")]: {
      fontSize: "0.8rem",
    },
    [breakpoints.only("sm")]: {
      fontSize: "0.9rem",
    },
    [breakpoints.up("md")]: {
      fontSize: "1.1rem",
    },
    textAlign: "center",
  },
  innerContainer: {
    display: "inline-flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  iconButton: {
    margin: "0 4px",
  },
  buttonContainer: {
    display: "inline-flex",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    width: "100%",
    height: "100%",
    margin: "0 12px",
  },
  heading: {
    fontSize: "1rem",
    flexBasis: "47%",
    flexShrink: 0,
    paddingRight: 10,
  },
  secondaryHeading: {
    fontSize: "0.85rem",
    color: COLORS.TextGray,
  },
  editSpan: {
    fontStyle: "italic",
    fontFamily: FONTS.Title,
    paddingLeft: 12,
    color: COLORS.InfoBlue,
    cursor: "pointer",
  },
  uploadedImageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  previewImage: {
    height: 240,
    marginBottom: 8,
  },
  variantsInputContainer: {
    width: "100%",
    margin: "8px 0",
  },
});
