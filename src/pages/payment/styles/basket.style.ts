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
    width: "100%",
    margin: "0 auto",
  },
  mainTitle: {
    fontSize: "1.6rem",
    margin: "0 10px",
    padding: "10px 0 5px",
    fontWeight: "bold",
  },
  overviewContainer: {
    background: COLORS.OffWhite,
    border: `1px solid ${COLORS.Pink}`,
    padding: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: "1.1rem",
    fontWeight: "bold",
  },
  subtotal: {
    marginTop: 8,
  },
  subtext: {
    margin: "0 10px 8px",
    fontSize: "0.8rem",
  },
});
