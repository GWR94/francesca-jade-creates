import { createStyles } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { FONTS } from "../../../themes";

const breakpoints = createBreakpoints({});

export default createStyles({
  container: {
    background: "#fff",
    padding: 24,
    boxSizing: "border-box",
    width: "400px",
    margin: "0 auto",
    fontFamily: FONTS.Title,
    borderRadius: 6,
    WebkitBorderRadius: 6,
    MozBorderRadius: 6,
    [breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  select: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeft: "none",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    marginLeft: -1,
  },
  formLabel: {
    marginTop: 12,
    textAlign: "center",
  },
});
