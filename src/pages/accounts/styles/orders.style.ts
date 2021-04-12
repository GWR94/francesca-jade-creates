import { createStyles } from "@material-ui/core";
import { COLORS, breakpoints } from "../../../themes/index";

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
  paidTag: {
    borderRadius: 3,
    fontWeight: "bold",
    border: `2px solid ${COLORS.SuccessGreen}`,
    minWidth: 60,
    [breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
    marginLeft: 10,
  },
  dangerIcon: {
    color: COLORS.ErrorRed,
    fontSize: "1.3rem",
    paddingLeft: 10,
  },
  successIcon: {
    color: COLORS.SuccessGreen,
    fontSize: "1.2rem",
    paddingLeft: 10,
  },
  paymentText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  paidLabel: {
    color: COLORS.SuccessGreen,
  },
  unpaidLabel: {
    color: COLORS.ErrorRed,
  },
  unpaidTag: {
    fontWeight: "bold",
    borderRadius: 3,
    border: `2px solid ${COLORS.ErrorRed}`,
    minWidth: 60,
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
  divider: {
    width: "60%",
    margin: "15px auto 10px",
  },
  details: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  data: {
    fontStyle: "italic",
    fontWeight: "normal",
    marginLeft: 5,
  },
  orderId: {
    fontStyle: "italic",
    fontWeight: "normal",
    marginLeft: 5,
    cursor: "pointer",
  },
  detailsText: {
    flexBasis: "50%",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "0.35em",
  },
  imagesContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    height: 500,
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
  nonIdealContainer: {
    height: "100%",
    minHeight: 400,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
});
