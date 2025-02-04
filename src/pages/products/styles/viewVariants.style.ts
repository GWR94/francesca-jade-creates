import { createStyles } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";

const breakpoints = createBreakpoints({});

export default createStyles({
  variantContainer: {
    width: "80%",
    margin: "0 auto",
    [breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  variantTitle: {
    fontSize: "1rem",
    fontWeight: "bold",
    textAlign: "center",
  },
  customFeatures: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
  },
  info: {
    color: "rgba(0,0,0,0.7)",
    marginLeft: 6,
  },
  featureContainer: {
    marginBottom: 6,
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontWeight: 800,
  },
  iconTextContainer: {
    display: "inline-flex",
    marginLeft: 12,
    alignItems: "center",
  },
  icon: {
    width: 20,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
});
