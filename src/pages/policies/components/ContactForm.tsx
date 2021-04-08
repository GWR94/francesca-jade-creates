import {
  TextField,
  Button,
  makeStyles,
  Typography,
  CircularProgress,
  useMediaQuery,
  Grid,
} from "@material-ui/core";
import { isEmail } from "validator";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { API } from "aws-amplify";
import React, { useState } from "react";
import { openSnackbar } from "../../../utils/Notifier";
import { INTENT } from "../../../themes";

interface ContactState {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  isSubmitting: boolean;
  errors: {
    firstName: string;
    email: string;
    message: string;
  };
}

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
  isSubmitting: false,
  errors: {
    firstName: "",
    email: "",
    message: "",
  },
};

const ContactForm = (): JSX.Element => {
  const [state, setState] = useState<ContactState>(initialState);

  const { firstName, lastName, email, message, isSubmitting, errors } = state;

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
          severity: INTENT.Success,
          message: "Message sent successfully.",
        });
      }
      setState(initialState);
    } catch (err) {
      openSnackbar({
        severity: INTENT.Danger,
        message: "Unable to send message. Please try again.",
      });
      setState({ ...state, isSubmitting: false });
    }
  };

  const handleValidation = (): void => {
    const errors = state.errors;
    let anyError = false;
    if (firstName.length === 0) {
      anyError = true;
      errors.firstName = "Please enter your first name.";
    }
    if (email.length === 0) {
      anyError = true;
      errors.email = "Please enter your email address.";
    }
    if (!isEmail(email)) {
      anyError = true;
      errors.email = "Please enter a valid email address.";
    }
    if (message.length < 10) {
      anyError = true;
      errors.message = "Please enter a descriptive message - 10 chars min.";
    }
    if (anyError) {
      setState({ ...state, errors });
    } else {
      handleSendMessage();
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
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <TextField
            value={firstName}
            onChange={(e): void =>
              setState({
                ...state,
                firstName: e.target.value,
                errors: { ...errors, firstName: "" },
              })
            }
            variant="outlined"
            label="First Name"
            required
            error={!!errors.firstName}
            helperText={errors.firstName}
            size={mobile ? "small" : "medium"}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            value={lastName}
            onChange={(e): void => setState({ ...state, lastName: e.target.value })}
            variant="outlined"
            label="Last Name"
            fullWidth
            size={mobile ? "small" : "medium"}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={email}
            onChange={(e): void =>
              setState({
                ...state,
                email: e.target.value,
                errors: { ...errors, email: "" },
              })
            }
            variant="outlined"
            required
            error={!!errors.email}
            helperText={errors.email}
            label="Email Address"
            size={mobile ? "small" : "medium"}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={message}
            onChange={(e): void =>
              setState({
                ...state,
                message: e.target.value,
                errors: { ...errors, message: "" },
              })
            }
            variant="outlined"
            label="Message"
            multiline
            required
            error={!!errors.message}
            helperText={errors.message}
            fullWidth
            rows={4}
            size={mobile ? "small" : "medium"}
          />
        </Grid>
      </Grid>
      <Button onClick={handleValidation} variant="outlined" color="primary">
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
