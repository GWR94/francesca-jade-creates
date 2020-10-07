import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { createStyles } from "@material-ui/core";
import { COLORS } from "../../../themes/index";

const breakpoints = createBreakpoints({});

export default createStyles({
  filterIcon: {
    fontSize: "36px", //FIXME
    color: COLORS.Pink,
    [breakpoints.down("md")]: {
      fontSize: "30px",
    },
    [breakpoints.down("sm")]: {
      fontSize: "24px",
    },
  },
  filterContainer: {
    position: "fixed",
    left: 0,
    top: "calc(50% - 20px)",
    cursor: "pointer",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    background: "#fff",
    border: "2px solid #eee",
    padding: 10,
    marginLeft: -2,
    [breakpoints.down("md")]: {
      marginLeft: -1,
      border: "1px solid #eee",
    },
    [breakpoints.down("sm")]: {
      padding: 8,
    },
    zIndex: 10,
  },
  gridContainer: {
    [breakpoints.down("sm")]: {
      margin: "0 15px",
    },
  },
});
