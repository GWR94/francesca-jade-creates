import { createStyles } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { COLORS } from "../../../themes";

const breakpoints = createBreakpoints({});

export default createStyles({
  container: {
    width: "100%",
    display: "inline-flex",
    background: "#fff",
    border: `1px solid ${COLORS.AltBorderGray}`,
    WebkitBorderRadius: 8,
    MozBorderRadius: 8,
    borderRadius: 8,
    position: "relative",
    marginBottom: 12,
    [breakpoints.only("xs")]: {
      padding: "8px 6px",
    },
    [breakpoints.only("sm")]: {
      padding: "12px 8px",
    },
    [breakpoints.up("md")]: {
      padding: "16px 10px",
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
  },
});
