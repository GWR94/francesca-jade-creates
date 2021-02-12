import { createStyles } from "@material-ui/core";
import { FONTS, breakpoints } from "../../../themes";

export default createStyles({
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    fontFamily: FONTS.Title,
    padding: "30px 24px",
    userSelect: "none",
    [breakpoints.down("xs")]: {
      justifyContent: "center",
      height: "100%",
    },
  },
  federated: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    paddingBottom: 20,
  },
  title: {
    fontSize: "1.4rem",
    textAlign: "center",
    fontWeight: "bold",
    padding: "10px 0",
  },
  subtitle: {
    fontSize: "0.9rem",
    fontStyle: "italic",
    textAlign: "center",
    paddingBottom: 10,
  },
  federatedButtons: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    justifyContent: "center",
  },
  button: {
    fontSize: "1.1rem",
    display: "flex",
    justifyContent: "space-evenly",
    width: 280,
    margin: "0 auto",
    textAlign: "center",
    [breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  google: {
    background: "#de5246",
    color: "#fff",
    "&:hover": {
      background: "#ff6b5e",
    },
  },
  facebook: {
    background: "#3b5998",
    color: "#fff",
    "&:hover": {
      background: "#5078cc",
    },
  },
  amazon: {
    background: "#ff9900",
    color: "#fff",
    "&:hover": {
      background: "#ffb74a",
    },
  },
  icon: {
    width: 30,
    textAlign: "right",
  },
  cognito: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  login: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  divider: {
    position: "relative",
    padding: "10px 0",
  },
  orText: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-60px)",
    width: 120,
    background: "#fff",
    top: 5,
    color: "rgba(0,0,0,0.7)",
    textAlign: "center",
  },
  forgotText: {
    color: "#337ab7",
    fontSize: "0.8rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: 10,
    "&:hover": {
      textDecoration: "underline",
    },
  },
  createText: {
    color: "#337ab7",
    fontWeight: "bold",
    cursor: "pointer",
    padding: "20px 0",
    textAlign: "right",
    "&:hover": {
      textDecoration: "underline",
    },
    [breakpoints.down("md")]: {
      padding: "10px 0",
    },
  },
  closeIcon: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});
