import { createStyles } from "@material-ui/core";
import { FONTS } from "../../../themes/index";

export default createStyles({
  basket: {
    padding: "8px 12px",
    minWidth: "220px",
    fontFamily: FONTS.Title,
    position: "relative",
    // Arrow towards parent
    "&:before": {
      content: "''",
      position: "absolute",
      left: "calc(50% - 10px)",
      top: -15,
      width: 0,
      height: 0,
      borderLeft: "15px solid transparent",
      borderRight: "15px solid transparent",
      borderBottom: "15px solid #eeeefa",
      clear: "both",
    },
    "&:after": {
      content: "''",
      position: "absolute",
      left: "calc(50% - 10px)",
      top: -14,
      width: 0,
      height: 0,
      borderLeft: "15px solid transparent",
      borderRight: "15px solid transparent",
      borderBottom: "15px solid #fff",
      clear: "both",
    },
  },
});