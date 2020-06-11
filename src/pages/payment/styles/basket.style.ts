import { createStyles } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { COLORS } from "../../../themes/index";

const breakpoints = createBreakpoints({});

export default createStyles({
  container: {
    [breakpoints.down("sm")]: {
      width: "95%",
    },
    [breakpoints.up("sm")]: {
      width: "90%",
    },
    margin: "0 auto",
  },
  overviewContainer: {
    background: COLORS.OffWhite,
    border: `1px solid ${COLORS.Pink}`,
    padding: 8,
    borderRadius: 4,
  },
});
