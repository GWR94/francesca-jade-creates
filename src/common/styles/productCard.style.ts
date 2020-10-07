import { createStyles } from "@material-ui/core";
import { FONTS } from "../../themes";

export default createStyles({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
  },
  media: {
    overflow: "hidden",
    width: "100%",
  },
  price: {
    textAlign: "center",
    margin: "10px 0",
    fontStyle: "italic",
    fontFamily: FONTS.Title,
  },
  root: {
    padding: 0,
    paddingBottom: "0 !important",
  },
  headerContainer: {
    minHeight: 55,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
