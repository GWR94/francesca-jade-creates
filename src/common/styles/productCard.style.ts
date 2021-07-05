import { createStyles } from "@material-ui/core";
import { COLORS, FONTS, breakpoints } from "../../themes/index";

export default createStyles({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    position: "relative",
    margin: "0 auto",
    width: "100%",
    WebkitTapHighlightColor: COLORS.Pink,
    "@media (max-width: 599px)": {
      width: 320,
    },
    "@media (max-width: 400px)": {
      width: "100%",
    },
  },
  cardContent: {
    height: "100%",
  },
  media: {
    overflow: "hidden",
    width: "100%",
  },
  price: {
    textAlign: "center",
    fontWeight: 200,
    textTransform: "uppercase",
    fontSize: "0.8rem",
    color: "rgba(0,0,0,0.7)",
    fontFamily: FONTS.Title,
    marginTop: 5,
  },
  tagline: {
    textAlign: "center",
    fontSize: "1rem",
    marginTop: -2,
  },
  title: {
    textAlign: "center",
    fontSize: "1.2rem",
    fontWeight: "bold",
    [breakpoints.down("sm")]: {
      fontSize: "1.1rem",
    },
  },
  root: {
    padding: 0,
    paddingBottom: "0 !important",
    height: "100%",
  },
  content: {
    minHeight: 90,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    padding: "10px 15px 0",
    boxSizing: "border-box",
  },
  headerContainer: {
    // minHeight: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "left",
    height: "100%",
  },
  options: {
    position: "absolute",
    top: -2,
    right: -2,
    zIndex: 1,
  },
});
