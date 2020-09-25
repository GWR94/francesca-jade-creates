import { createStyles, makeStyles, Theme } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { COLORS } from "../../../themes";

const breakpoints = createBreakpoints({});

export default createStyles({
  root: {
    width: "70%",
    margin: "0 auto",
    [breakpoints.down("sm")]: {
      width: "90%",
    },
  },
  heading: {
    fontSize: "1rem",
    flexBasis: "50%",
    flexShrink: 0,
    [breakpoints.down("sm")]: {
      fontSize: "0.9rem",
    },
  },
  secondaryHeading: {
    fontSize: "1rem",
    display: "inline-flex",
    alignItems: "center",
    [breakpoints.down("sm")]: {
      fontSize: "0.9rem",
    },
  },
  content: {
    alignItems: "center",
  },
  detailsRoot: {
    display: "inline-flex",
    flexDirection: "column",
  },
  paidTag: {
    borderRadius: 3,
    background: COLORS.SuccessGreen,
    width: 80,
    [breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
  },
  unpaidTag: {
    borderRadius: 3,
    background: COLORS.ErrorRed,
    width: 80,
    [breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
  },
  headingTitle: {
    fontWeight: "bold",
    fontSize: "1.1rem",
    flexBasis: "48%",
    flexShrink: 0,
    [breakpoints.down("sm")]: {
      fontSize: "1rem",
    },
  },
  secondaryTitle: {
    fontWeight: "bold",
    fontSize: "1.1rem",
    [breakpoints.down("sm")]: {
      fontSize: "1rem",
    },
  },
  details: {
    fontWeight: "bold",
    fontSize: "1rem",
    [breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
  },
  detailsContainer: {
    display: "inline-flex",
    width: "100%",
  },
  data: {
    fontStyle: "italic",
    fontWeight: "normal",
    marginLeft: 5,
  },
  detailsText: {
    flexBasis: "50%",
  },
  products: {
    flexBasis: "50%",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "0.35em",
  },
  orderId: {
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: 5,
  },
});
