import { createStyles } from "@material-ui/core";
import { COLORS } from "../../../themes/index";

export default createStyles({
  nav: {
    borderTop: `3px solid ${COLORS.Pink}`,
    display: "flex",
    borderBottom: "none",
    padding: "0 20px",
    userSelect: "none",
    MozUserSelect: "none",
    WebkitUserSelect: "none",
    msUserSelect: "none",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  main: {
    display: "inline-flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0 auto",
  },
  menuIcon: {
    fontSize: "35px",
    display: "flex",
    alignContent: "center",
    color: COLORS.Pink,
  },
  logo: {
    height: 40,
    width: 40,
    padding: 5,
    marginRight: 20,
    display: "inline-block",
  },
  logoFixed: {
    height: 40,
    width: 40,
    padding: 5,
    position: "absolute",
    left: "calc(50% - 25px)",
  },
});
