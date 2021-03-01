import { createStyles } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { FONTS } from "../../../themes/index";

const breakpoints = createBreakpoints({});

export default createStyles({
  container: {
    fontFamily: FONTS.Title,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    // minHeight: "calc(100vh - 54px)",
    justifyContent: "space-evenly",
    width: 980,
    margin: "0 auto",
    paddingTop: 20,
    [breakpoints.down("md")]: {
      width: "90%",
    },
  },
  title: {
    marginBottom: 8,
  },
  tagline: {
    textAlign: "center",
    color: "rgba(0,0,0,0.6)",
  },
  thumbnail: {
    border: "2px solid red !important",
    padding: "20px !important",
    "&:active": {
      border: "2px solid green !important",
    },
  },
  tagsContainer: {
    display: "flex",
    justifyContent: "center",
    margin: "14px 0",
  },
  chip: {
    margin: "0 4px 4px",
    color: "#fff",
  },
  viewIcon: {
    marginRight: 5,
  },
  buttonContainer: {
    marginTop: 30,
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  button: {},
});
