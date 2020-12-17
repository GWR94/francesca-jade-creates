import { createStyles } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { COLORS } from "../../../themes/index";

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
    textAlign: "center",
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
    minWidth: 90,
    [breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
    marginLeft: 10,
  },
  unpaidTag: {
    borderRadius: 3,
    background: COLORS.ErrorRed,
    minWidth: 90,
    [breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
    marginLeft: 10,
  },
  headingTitle: {
    fontWeight: "bold",
    fontSize: "1.1rem",
    textAlign: "center",
    [breakpoints.down("sm")]: {
      fontSize: "1rem",
    },
  },
  secondaryTitle: {
    fontWeight: "bold",
    fontSize: "1.1rem",
    textAlign: "center",
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
  variantContainer: {
    marginBottom: 8,
    borderRadius: 6,
    padding: "10px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    [breakpoints.down("sm")]: {
      padding: "4px 6px",
    },
  },
  formControl: {
    minWidth: 200,
  },
  chipSuccess: {
    width: 40,
    borderRadius: 3,
    background: COLORS.SuccessGreen,
    textAlign: "center",
    paddingTop: 3,
    margin: "0 3px",
    [breakpoints.up("sm")]: {
      width: 90,
    },
  },
  chipDanger: {
    width: 40,
    borderRadius: 3,
    background: COLORS.ErrorRed,
    textAlign: "center",
    paddingTop: 3,
    margin: "0 3px",
    [breakpoints.up("sm")]: {
      width: 90,
    },
  },
  orderText: {
    textAlign: "right",
    fontSize: "1rem",
    fontWeight: "bold",
    paddingRight: 12,
  },
  paymentButton: {
    [breakpoints.down("sm")]: {
      fontSize: "0.7rem",
    },
  },
  nonIdealContainer: {
    height: "100%",
    minHeight: 400,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
});
