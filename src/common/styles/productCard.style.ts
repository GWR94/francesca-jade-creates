import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { createStyles } from "@material-ui/core";
import { FONTS } from "../../themes";

const breakpoints = createBreakpoints({});

export default createStyles({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    margin: "0 auto",
    width: "100%",
    "@media (max-width: 599px)": {
      width: 320,
    },
    "@media (max-width: 400px)": {
      width: "100%",
    },
  },
  media: {
    overflow: "hidden",
    width: "100%",
  },
  price: {
    textAlign: "center",
    margin: "10px 0",
    fontStyle: "italic",
    fontFamily: FONTS.Title,
    [breakpoints.down("sm")]: {
      margin: "5px 0",
      fontSize: "0.8rem",
    },
  },
  root: {
    padding: 0,
    paddingBottom: "0 !important",
  },
  headerContainer: {
    minHeight: 55,
    margin: "0 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  options: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
});
