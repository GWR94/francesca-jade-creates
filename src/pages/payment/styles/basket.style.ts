import { createStyles } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { COLORS } from "../../../themes/index";

const breakpoints = createBreakpoints({});

export default createStyles({
  container: {
    [breakpoints.down("sm")]: {
      width: "95%",
    },
    [breakpoints.up("sm")]: {
      width: "90%",
    },
    width: "100%",
    margin: "0 auto",
    paddingTop: 10,
    minHeight: "50vh",
    display: "flex",
    flexDirection: "column",
  },
  mainTitle: {
    fontSize: "1.6rem",
    margin: "0 10px",
    padding: "10px 0 5px",
    fontWeight: "bold",
  },
  overviewContainer: {
    background: COLORS.OffWhite,
    border: `1px solid ${COLORS.Pink}`,
    padding: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  subtotal: {
    marginTop: 8,
  },
  subtext: {
    margin: "10px 0",
    lineHeight: 1.3,
    fontSize: "1rem",
    [breakpoints.down("md")]: {
      fontSize: "0.9rem",
    },
    [breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
  },
  variantsContainer: {
    borderRadius: 5,
    border: `1px solid ${COLORS.DisabledGray}`,
    width: 500,
    margin: "0 auto",
    [breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  innerContainer: {
    display: "inline-flex",
    width: "100%",
    height: "100%",
    padding: 12,
    boxSizing: "border-box",
    cursor: "default",
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "space-evenly",
    width: "100%",
    paddingLeft: 12,
  },
  costContainer: {
    display: "inline-flex",
  },
  icon: {
    width: 30,
    display: "flex",
    justifyContent: "center",
    color: COLORS.DarkPink,
  },
  select: {
    width: "100%",
  },
  itemContainer: {
    margin: "20px auto 0",
    width: 500,
    [breakpoints.down("sm")]: {
      width: "95%",
    },
  },
  successContainer: {
    width: "100%",
    display: "flex",
    height: "100%",
    flexDirection: "column",
    minHeight: 400,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  outerContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  textCenter: {
    textAlign: "center",
  },
  infoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 8,
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    margin: "12px 0 4px",
    fontSize: "0.9rem",
    [breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
  },
  root: {
    padding: "10.5px 0 !important",
    [breakpoints.down("sm")]: {
      fontSize: "0.9rem",
    },
  },
  priceContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  priceInner: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  MuiInputBase: {
    padding: 0,
  },
  outlined: {
    paddingBottom: 10,
  },
  checkout: {
    background: COLORS.OffWhite,
    height: "100%",
  },
  button: {
    margin: "0 5px",
  },
  stepButtonContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "20px",
  },
  priceTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    marginTop: 6,
  },
  accordionRoot: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: 0,
    boxSizing: "border-box",
  },
  header: {
    fontWeight: "bold",
    // textAlign: "center",
    width: "100%",
  },
  checkoutContainer: {
    marginBottom: 10,
  },
  nonIdealContainer: {
    marginTop: "25vh",
  },
});
