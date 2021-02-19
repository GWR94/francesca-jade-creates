import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { createStyles } from "@material-ui/core";
import { FONTS } from "../../../themes/index";

const breakpoints = createBreakpoints({});

export default createStyles({
  container: {
    margin: "0 auto",
    fontFamily: FONTS.Title,
    width: 800,
    [breakpoints.down("md")]: {
      width: 620,
    },
    [breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  row: {
    marginBottom: 8,
    position: "relative",
  },
  verifiedTag: {
    position: "absolute",
    right: "14px",
    top: "22px",
  },
  buttonBottom: {
    marginBottom: 40,
    marginTop: 10,
    marginLeft: 5,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "2.2rem",
  },
  info: {
    fontSize: "1rem",
    color: "rgba(0,0,0,0.7)",
    textAlign: "center",
    margin: "10px auto",
  },
  heading: {
    fontSize: "1.2rem",
    fontWeight: 500,
    marginBottom: 10,
  },
  optionalText: {
    color: "darkgrey",
    fontStyle: "italic",
    fontSize: "1rem",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
});
