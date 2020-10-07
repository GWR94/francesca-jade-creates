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
  },
  chipCreates: {
    background: COLORS.Purple,
  },
  mainContainer: {
    margin: "0 auto",
    width: 720,
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
    margin: "10px 0",
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
  icon: {
    width: 20,
    textAlign: "center",
  },
  customNumber: {
    fontSize: "2rem",
    width: 30,
    textAlign: "center",
  },
  tinyEditor: {
    borderRadius: 5,
  },
});
