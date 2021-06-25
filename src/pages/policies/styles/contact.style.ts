import { createStyles } from "@material-ui/core";
import { breakpoints, COLORS } from "../../../themes";

export default createStyles({
  avatar: {
    height: 120,
    width: 120,
    margin: "0 auto",
    border: `3px solid ${COLORS.LightGray}`,
    [breakpoints.only("sm")]: {
      height: 100,
      width: 100,
      marginBottom: 20,
    },
    [breakpoints.only("xs")]: {
      height: 80,
      width: 80,
      marginBottom: 20,
    },
  },
  text: {
    textAlign: "center",
    fontStyle: "italic",
  },
  innerContainer: {
    width: 200,
    height: 120,
    display: "flex",
    margin: "auto auto 10px",
    borderRadius: 15,
    padding: 16,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  outerContainer: {
    width: 800,
    margin: "0 auto",
    [breakpoints.down("sm")]: {
      width: "80%",
    },
  },
  icon: {
    fontSize: "30px",
    fontWeight: 500,
    textAlign: "center",
    height: 30,
    width: 30,
  },
  dividerText: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-90px)",
    background: "#fff",
    top: -12,
    width: 180,
    textAlign: "center",
    color: "rgba(0,0,0,0.5)",
  },
  overview: {
    fontSize: "1rem",
    textAlign: "justify",
    marginRight: 30,
    [breakpoints.down("sm")]: {
      marginRight: 0,
    },
  },
});
