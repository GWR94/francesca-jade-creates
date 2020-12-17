import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { createStyles } from "@material-ui/core";
import { FONTS } from "../../../themes";

const breakpoints = createBreakpoints({});
export default createStyles({
  text: {
    fontSize: "1rem",
    marginBottom: 10,
    fontFamily: FONTS.Title,
    display: "block",
  },
  container: {
    paddingTop: 10,
    width: 800,
    margin: "0 auto",
    display: "block",
    [breakpoints.down("xs")]: {
      width: "90%",
    },
    fontFamily: FONTS.Title,
  },
});
