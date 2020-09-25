import { createStyles } from "@material-ui/core";
import { COLORS } from "../../../themes";

export default createStyles({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: "1rem",
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: "0.8rem",
    color: COLORS.LightGray,
  },
});
