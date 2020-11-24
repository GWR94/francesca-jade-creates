import { createStyles } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { FONTS } from "../../../themes/index";

const breakpoints = createBreakpoints({});

export default createStyles({
  container: {
    fontFamily: FONTS.Title,
    justifyContent: "space-evenly",
    width: 980,
    margin: "0 auto",
    paddingTop: 20,
    [breakpoints.down("md")]: {
      width: "100%",
    },
    [breakpoints.down("sm")]: {
      width: "90%",
    },
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
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    margin: "10px 10px 30px",
  },
});
