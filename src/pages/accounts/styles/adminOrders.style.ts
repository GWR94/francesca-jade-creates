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
  dialog: {
    height: 600,
    width: 500,
    padding: 20,
    margin: "auto",
    boxSizing: "border-box",
    [breakpoints.down("xs")]: {
      width: "100%",
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
  divider: {
    width: "60%",
    margin: "5px auto 10px",
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
    [breakpoints.down("xs")]: {
      fontSize: "0.9rem",
    },
  },
  data: {
    fontStyle: "italic",
    fontWeight: "normal",
    marginLeft: 5,
  },
  paymentText: {
    fontWeight: "bold",
    textAlign: "center",
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
  paid: {
    color: COLORS.WarningOrange,
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  shipped: {
    color: COLORS.SuccessGreen,
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  unpaid: {
    color: COLORS.ErrorRed,
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  orderId: {
    cursor: "pointer",
    marginLeft: 5,
    fontWeight: "normal",
    "&:hover": {
      textDecoration: "underline",
    },
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
});
