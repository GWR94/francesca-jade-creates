import { createStyles } from "@material-ui/core";
import { FONTS, COLORS } from "../../../themes/index";

export default createStyles({
  nav: {
    borderTop: `3px solid ${COLORS.Pink}`,
    display: "flex",
    background: "#fff",
    borderBottom: "none",
    padding: "0 20px",
    userSelect: "none",
    MozUserSelect: "none",
    WebkitUserSelect: "none",
    msUserSelect: "none",
    // flexDirection: "column",
  },
  main: {
    display: "inline-flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0 15px 0 20px",
  },
  menuIcon: {
    fontSize: "35px",
    display: "flex",
    alignContent: "center",
  },
  logo: {
    height: 50,
    width: 50,
    marginRight: 20,
    display: "inline-block",
  },
});
