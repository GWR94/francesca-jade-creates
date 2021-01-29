import {
  TextField,
  Button,
  makeStyles,
  Typography,
  CircularProgress,
  useMediaQuery,
} from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { API } from "aws-amplify";
import React, { useState } from "react";
import { openSnackbar } from "../../../utils/Notifier";

interface ContactState {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
  isSubmitting: boolean;
}

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  message: "",
  isSubmitting: false,
};

const ContactForm = (): JSX.Element => {
  const [state, setState] = useState<ContactState>(initialState);

  const { firstName, lastName, email, message, isSubmitting } = state;

  const handleSendMessage = async (): Promise<void> => {
    setState({ ...state, isSubmitting: true });
    try {
      const res = await API.post("orderlambda", "/orders/send-message", {
        body: {
          firstName,
          lastName,
          email,
          message,
        },
      });
      if (res) {
        openSnackbar({
          severity: "success",
          message: "Message sent successfully.",
        });
      }
      setState(initialState);
    } catch (err) {
      openSnackbar({
        severity: "error",
        message: "Unable to send message. Please try again.",
      });
      setState({ ...state, isSubmitting: false });
    }
  };
  const breakpoints = createBreakpoints({});
  const useStyles = makeStyles({
    form: {
      width: 500,
      padding: 10,
      display: "flex",
      flexDirection: "column",
      margin: "0 auto",
      "& > *": {
        marginBottom: 8,
      },
      [breakpoints.down("sm")]: {
        width: "90%",
      },
    },
  });

  const classes = useStyles();
  const mobile = useMediaQuery(breakpoints.down("md"));

  return (
    <div className={classes.form}>
      <TextField
        value={firstName}
        onChange={(e): void => setState({ ...state, firstName: e.target.value })}
        variant="outlined"
        label="First Name"
        required
        size={mobile ? "small" : "medium"}
      />
      <TextField
        value={lastName}
        onChange={(e): void => setState({ ...state, lastName: e.target.value })}
        variant="outlined"
        label="Last Name"
        size={mobile ? "small" : "medium"}
      />
      <TextField
        value={email}
        onChange={(e): void => setState({ ...state, email: e.target.value })}
        variant="outlined"
        required
        label="Email Address"
        size={mobile ? "small" : "medium"}
      />
      <TextField
        value={message}
        onChange={(e): void => setState({ ...state, message: e.target.value })}
        variant="outlined"
        label="Message"
        multiline
        required
        rows={4}
        size={mobile ? "small" : "medium"}
      />
      <Button onClick={handleSendMessage} variant="outlined" color="primary">
        {isSubmitting ? <CircularProgress size={20} /> : "Send Message"}
      </Button>
      <Typography
        variant="subtitle2"
        style={{ textAlign: "left", color: "rgba(0,0,0,0.6)", marginTop: 0 }}
      >
        All required fields are marked with a *
      </Typography>
    </div>
  );
};

export default ContactForm;
