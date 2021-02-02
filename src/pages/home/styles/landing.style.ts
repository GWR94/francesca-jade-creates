import { createStyles } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { FONTS, COLORS } from "../../../themes";

const breakpoints = createBreakpoints({});

export default createStyles({
  container: {
    padding: "30px 0",
    minHeight: "calc(100vh - 54px)",
  },
  headingText: {
    fontFamily: FONTS.Text,
    fontSize: "2.8rem",
    fontWeight: "bold",
    textAlign: "left",
    [breakpoints.down("lg")]: {
      fontSize: "2.6rem",
    },
    [breakpoints.down("md")]: {
      fontSize: "2.4rem",
    },
    // [breakpoints.down("sm")]: {
    //   fontSize: "2.1rem",
    // },
  },
  subheadingText: {
    color: "rgba(0,0,0,0.7)",
    lineHeight: 1.1,
    fontSize: "1.4rem",
    fontFamily: FONTS.Title,
    textAlign: "left",
    marginBottom: 30,
    [breakpoints.down("md")]: {
      fontSize: "1.3rem",
    },
    [breakpoints.down("sm")]: {
      fontSize: "1.2rem",
    },
  },
  headingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    marginBottom: 30,
  },
  subheading: {
    fontSize: "1.2rem",
    margin: "10px",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: FONTS.Title,
    color: "rgba(0,0,0,0.8)",
    [breakpoints.down("md")]: {
      fontSize: "1rem",
    },
  },
  imageContainer: {
    position: "relative",
    width: 400,
    height: 400,
    display: "block",
    overflow: "hidden",
    borderRadius: 20,
    margin: "auto",
    // padding: "20px 0",
    top: "50%",
    transform: "translateY(-50%)",
    "&:before": {
      content: "''",
      position: "absolute",
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
    },
    [breakpoints.down("sm")]: {
      width: 300,
      height: 300,
    },
  },
  mobileImage: {
    height: "auto",
    background: "green",
  },
  video: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -150,
  },
  landingImage: {
    maxWidth: "100%",
    padding: "20px 40px",
    boxSizing: "border-box",
  },
  logoImg: {
    width: 60,
    height: 60,
    margin: "0 auto 10px",
    [breakpoints.down("md")]: {
      height: 40,
      width: 40,
    },
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
    background: COLORS.DarkGrey,
    color: "#fff",
    borderRadius: 20,
    margin: "6px auto 12px",
    "&:hover": {
      background: COLORS.Gray,
    },
    [breakpoints.up("sm")]: {
      width: 220,
    },
  },
  cakeIcon: {
    [breakpoints.down("md")]: {
      fontSize: "2.2rem",
    },
    fontSize: "3rem",

    color: COLORS.Pink,
  },
  createsIcon: {
    [breakpoints.down("md")]: {
      fontSize: "2.2rem",
    },
    fontSize: "3rem",
    color: COLORS.LightGray,
  },
  createsContainer: {
    [breakpoints.down("md")]: {
      width: 40,
      height: 40,
    },
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: COLORS.Pink,
    border: `3px solid ${COLORS.LightGray}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
  },
  cakesContainer: {
    [breakpoints.down("md")]: {
      width: 40,
      height: 40,
    },
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: COLORS.LightGray,
    border: `3px solid ${COLORS.Pink}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px auto 0",
  },
});
