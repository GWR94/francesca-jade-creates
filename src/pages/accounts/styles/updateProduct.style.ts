import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { createStyles } from "@material-ui/core";
import { FONTS, COLORS } from "../../../themes";

const breakpoints = createBreakpoints({});

export default createStyles({
  root: {
    marginTop: 5,
  },
  chipCake: {
    background: COLORS.Pink,
    [breakpoints.down("md")]: {
      margin: "0 4px 0 0",
      fontSize: "11px",
      height: 24,
    },
  },
  chipCreates: {
    background: COLORS.Purple,
    [breakpoints.down("md")]: {
      margin: "0 4px 0 0",
      fontSize: "11px",
      height: 24,
    },
  },
  chipInput: {
    padding: "6px 10px 6px !important",
  },
  customisableContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: 300,
    alignItems: "center",
    margin: "0 auto",
    [breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  icon: {
    width: 20,
    textAlign: "center",
  },
  customNumber: {
    fontSize: "2rem",
    width: 30,
    textAlign: "center",
  },
  mainContainer: {
    margin: "0 auto",
    width: 640,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff",
    fontFamily: FONTS.Title,
    [breakpoints.down("sm")]: {
      width: "90%",
    },
  },
  callout: {
    margin: "12px 0",
    width: "100%",
    boxSizing: "border-box",
  },
  switch: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  errorText: {
    fontSize: "0.75rem",
    color: COLORS.ErrorRed,
    margin: 0,
    marginBottom: 6,
    padding: "0 14px",
    width: "100%",
    textAlign: "left",
    marginTop: -4,
  },
});
