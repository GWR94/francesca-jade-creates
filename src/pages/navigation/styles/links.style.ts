import { createStyles } from "@material-ui/core";
import { FONTS, COLORS } from "../../../themes/index";

export default createStyles({
  badge: {
    backgroundColor: COLORS.Pink,
    color: "#fff",
    marginRight: 3,
  },
  badgeRoot: {
    margin: 0,
  },
  links: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
  },
  mobileLinks: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: -15,
  },
  navMobile: {
    display: "flex",
    flexDirection: "column",
  },
  navLeft: {
    display: "inline-flex",
    float: "left",
  },
  navRight: {
    display: "inline-flex",
    justifyContent: "flex-end",
  },

  link: {
    height: 50,
    padding: "0 10px",
    textAlign: "center",
    display: "flex",
    textDecoration: "none",
    fontFamily: FONTS.Title,
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    cursor: "pointer",
    color: "black !important",
    fontWeight: "bold",
    margin: "0 4px",
    fontSize: "0.8rem",
    textTransform: "uppercase",
    "&:hover": {
      paddingTop: 2,
      textDecoration: "none",
      borderBottom: `2px solid ${COLORS.DarkPink} !important`,
    },
  },
  linkActive: {
    height: 50,
    padding: "0 10px",
    textAlign: "center",
    display: "flex",
    cursor: "pointer",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: FONTS.Title,
    color: `${COLORS.DarkPink} !important`, // ? Important may be needed
    borderBottom: `2px solid ${COLORS.Pink}`,
    fontWeight: "bold",
    margin: "0 4px",
    boxSizing: "border-box",
    textTransform: "uppercase",
    "&:hover": {
      paddingBottom: 2,
      textDecoration: "none",
      borderBottom: `2px solid ${COLORS.DarkPink}`,
    },
  },
  linkActiveDiv: {
    height: 50,
    fontSize: "0.8rem",
    padding: "0 10px",
    textAlign: "center",
    display: "flex",
    cursor: "pointer",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: FONTS.Title,
    color: `${COLORS.DarkPink} !important`, // ? Important may be needed
    borderBottom: `2px solid ${COLORS.Pink}`,
    fontWeight: "bold",
    margin: "0 4px",
    boxSizing: "border-box",
    textTransform: "uppercase",
    "&:hover": {
      textDecoration: "none",
      borderBottom: `2px solid ${COLORS.DarkPink}`,
    },
  },
  navIcon: {
    fontSize: "1.4rem",
    marginRight: 5,
  },
});
