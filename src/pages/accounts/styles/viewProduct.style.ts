import { createStyles } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { wrap } from "underscore";
import { FONTS } from "../../../themes/index";

const breakpoints = createBreakpoints({});

export default createStyles({
  container: {
    fontFamily: FONTS.Title,
    width: 860,
    justifyContent: "space-evenly",
    margin: "0 auto",
    paddingTop: 20,
    [breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  variantContainer: {
    width: "100%",
    display: "inline-flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  variant: {
    width: "50%",
    margin: "10px 0",
  },
  variantTitle: {
    fontSize: "1rem",
    fontWeight: "bold",
  },
  customFeatures: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
  },
  info: {
    fontStyle: "italic",
  },
  break: {
    flexBasis: "100%",
    height: 0,
  },
});
