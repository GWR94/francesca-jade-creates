import { createStyles } from "@material-ui/core";
import { FONTS, COLORS } from "../../../themes/index";

export default createStyles({
  badge: {
    marginTop: 6,
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
    width: 120,
    height: 50,
    textAlign: "center",
    display: "flex",
    textDecoration: "none",
    fontFamily: FONTS.Title,
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    color: "black !important",
    fontWeight: "bold",
    margin: "0 4px",
    fontSize: "1rem",
    "&:hover": {
      paddingTop: 2,
      boxSizing: "border-box",
      textDecoration: "none",
      borderBottom: `2px solid ${COLORS.LightPink}`,
    },
  },
  linkActive: {
    width: 120,
    height: 50,
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
    "&:hover": {
      textDecoration: "none",
      borderBottom: `2px solid ${COLORS.LightPink}`,
    },
  },
  navIcon: {
    fontSize: "1.3rem",
    marginRight: 10,
  },
});