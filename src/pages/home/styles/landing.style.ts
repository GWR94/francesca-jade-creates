import { createStyles } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { FONTS, COLORS } from "../../../themes";

const breakpoints = createBreakpoints({});

export default createStyles({
  headingText: {
    fontFamily: FONTS.Text,
    fontSize: "2.8rem",
    fontWeight: "bold",
    [breakpoints.down("md")]: {
      fontSize: "2rem",
    },
  },
  headingContainer: {
    height: "calc(100vh - 86px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  },
  subheading: {
    fontSize: "1.2rem",
    margin: "10px",
    fontWeight: "bold",
    fontFamily: FONTS.Title,
    [breakpoints.down("md")]: {
      fontSize: "1rem",
    },
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  landingImage: {
    maxWidth: "100%",
    padding: "20px 40px",
    boxSizing: "border-box",
  },
  logoImg: {
    width: 80,
    height: 80,
    margin: "0 auto 10px",
  },
  createsButton: {
    background: COLORS.DarkPink,
    color: "#fff",
    borderRadius: 20,
    margin: "6px auto 12px",
    "&:hover": {
      background: COLORS.Pink,
    },
    [breakpoints.up("sm")]: {
      width: 220,
    },
  },
  cakesButton: {
    background: COLORS.Gray,
    color: "#fff",
    borderRadius: 20,
    margin: "6px auto 12px",
    "&:hover": {
      background: COLORS.LightGray,
    },
    [breakpoints.up("sm")]: {
      width: 220,
    },
  },
  cakeIcon: {
    fontSize: "3rem",
    color: COLORS.DarkPink,
    margin: "12px auto 0",
  },
  createsIcon: {
    fontSize: "3rem",
    color: COLORS.Gray,
    margin: "12px auto 0",
  },
});
