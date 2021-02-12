import { createStyles } from "@material-ui/core";
import { COLORS, breakpoints } from "../../../themes";

export default createStyles({
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
    border: `2px solid ${COLORS.SuccessGreen}`,
    minWidth: 90,
    [breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
    marginLeft: 10,
  },
  unpaidTag: {
    borderRadius: 3,
    border: `2px solid ${COLORS.ErrorRed}`,
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
  data: {
    fontStyle: "italic",
    fontWeight: "normal",
    marginLeft: 5,
  },
  detailsText: {
    flexBasis: "50%",
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
});
