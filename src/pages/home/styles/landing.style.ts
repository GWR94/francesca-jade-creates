import { createStyles } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { FONTS, COLORS } from "../../../themes";

const breakpoints = createBreakpoints({});

export default createStyles({
  headingText: {
    fontFamily: FONTS.Title,
    fontSize: "2.8rem",
    fontWeight: "bold",
    [breakpoints.down("md")]: {
      fontSize: "2rem",
    },
  },
  headingContainer: {
    height: "calc(100vh - 70px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  },
  subheading: {
    fontSize: "1.3rem",
    margin: "10px",
    [breakpoints.down("md")]: {
      fontSize: "1.2rem",
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
  },
  logoImg: {
    width: 80,
    height: 80,
    margin: "0 auto 10px",
  },
  cakesButton: {
    background: COLORS.DarkPink,
    color: "#fff",
    margin: "12px 0",
    borderRadius: 20,
    "&:hover": {
      background: COLORS.Pink,
    },
    [breakpoints.up("sm")]: {
      width: 220,
      margin: "12px auto",
    },
  },
  createsButton: {
    background: COLORS.Purple,
    color: "#fff",
    borderRadius: 20,
    "&:hover": {
      background: COLORS.LightPurple,
    },
    [breakpoints.up("sm")]: {
      width: 220,
      margin: "0 auto",
    },
  },
});
