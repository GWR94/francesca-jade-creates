import { createStyles } from "@material-ui/core";

export default createStyles({
  variantContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  variant: {
    width: "50%",
    // margin: "10px 0",
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
