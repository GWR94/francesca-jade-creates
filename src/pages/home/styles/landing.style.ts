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
    height: "calc(100vh - 54px)",
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
    position: "relative",
    width: 400,
    height: 400,
    display: "block",
    borderRadius: "50%",
    overflow: "hidden",
    margin: "auto",
    top: "50%",
    transform: "translateY(-50%)",
    "&:before": {
      content: "''",
      position: "absolute",
      background: "rgba(255, 150, 202, 0.5)",
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
    },
  },
  video: {
    width: "100%",
    display: "block",
    marginTop: -150,
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
