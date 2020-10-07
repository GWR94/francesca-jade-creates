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
    fontSize: "1.2rem",
    margin: "10px",
    fontWeight: "bold",
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
    background: COLORS.Purple,
    color: "#fff",
    borderRadius: 20,
    margin: "6px auto 12px",
    "&:hover": {
      background: COLORS.LightPurple,
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
    color: COLORS.Purple,
    margin: "12px auto 0",
  },
});
