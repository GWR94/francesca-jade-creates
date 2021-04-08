import React, { useState } from "react";
import {
  Dialog,
  Button,
  TextField,
  Grid,
  DialogTitle,
  DialogContent,
  CircularProgress,
  DialogActions,
  makeStyles,
  Typography,
} from "@material-ui/core";
import validate from "validate.js";
import { Auth } from "aws-amplify";
import { openSnackbar } from "../../../utils/Notifier";
import PasswordInput from "../../../common/inputs/PasswordInput";
import { CreateProps, CreateState } from "../interfaces/Create.i";
import { FONTS, INTENT } from "../../../themes";

const initialState = {
  username: {
    value: "",
    error: "",
  },
  password: {
    value: "",
    error: "",
  },
  email: {
    value: "",
    error: "",
  },
  codeSent: false,
  destination: "",
  code: "",
  codeLoading: false,
  createLoading: false,
};

const CreateAccountDialog: React.FC<CreateProps> = ({ isOpen, onClose }): JSX.Element => {
  const [state, setState] = useState<CreateState>(initialState);

  const useStyles = makeStyles({
    container: {
      fontFamily: FONTS.Title,
    },
    buttonContainer: {
      display: "inline-flex",
      width: "100%",
      justifyContent: "center",
    },
    button: {
      margin: "0 5px",
    },
    forgot: {
      color: "#337ab7",
      fontWeight: "bold",
      cursor: "pointer",
      width: 160,
      marginBottom: 10,
      "&:hover": {
        textDecoration: "underline",
      },
    },
  });
  const classes = useStyles();

  const handleCreateAccount = async (): Promise<void> => {
    const { username, password, email } = state;
    try {
      const { codeDeliveryDetails } = await Auth.signUp({
        username: username.value,
        password: password.value,
        attributes: {
          email: email.value,
        },
      });
      setState({
        ...state,
        createLoading: false,
        codeSent: true,
        destination: codeDeliveryDetails.Destination,
      });
    } catch (err) {
      setState({ ...state, createLoading: false });
      openSnackbar({
        severity: INTENT.Danger,
        message: err.message,
      });
    }
  };

  const handleErrorCheck = (): void => {
    const { username, password, email } = state;
    let updatedState = state;
    let errors = false;
    const invalidEmail = validate({ from: email.value }, { from: { email: true } });
    if (invalidEmail) {
      errors = true;
      setState({
        ...state,
        email: {
          ...email,
          error: "Please enter a valid email address.",
        },
      });
    }
    const validUsername = /^[a-z0-9_-]{3,15}$/i.test(username.value);
    if (!validUsername) {
      errors = true;
      updatedState = {
        ...updatedState,
        username: {
          ...username,
          error:
            'Please enter a valid username. Only alphanumeric and "_" or "-" characters are allowed.',
        },
      };
    }
    if (username.value.length < 3 || username.value.length > 15) {
      updatedState = {
        ...updatedState,
        username: {
          ...username,
          error: "Please enter a valid username. (min 3 characters, max 15 characters)",
        },
      };
    }
    if (password.value.length < 8) {
      updatedState = {
        ...updatedState,
        password: {
          ...password,
          error: "Please enter a valid password. (min 8 characters)",
        },
      };
    }

    if (errors) {
      setState({ ...updatedState, createLoading: false });
      openSnackbar({
        severity: INTENT.Danger,
        message: "Please check the highlighted fields.",
      });
      return;
    }
    handleCreateAccount();
  };

  const handleResendVerificationCode = async (): Promise<void> => {
    const { username } = state;
    try {
      await Auth.resendSignUp(username.value);
      openSnackbar({
        severity: INTENT.Success,
        message: "Verification code resent.",
      });
    } catch (err) {
      openSnackbar({
        severity: INTENT.Danger,
        message: "Failed to send email. Please try again.",
      });
    }
  };

  const handleVerifyCode = async (): Promise<void> => {
    const { username, code } = state;

    try {
      await Auth.confirmSignUp(username.value, code);
      setState({
        ...state,
        codeLoading: false,
      });
      openSnackbar({
        severity: INTENT.Success,
        message: "Account successfully created.",
      });
      onClose();
    } catch (err) {
      setState({
        ...state,
        codeLoading: false,
      });
      let message;
      switch (err.name) {
        case "AliasExistsException":
          message = "Email is already being used. Please sign in with these credentials.";
          break;
        case "CodeMismatchException":
          message = "Incorrect validation code. Please try again.";
          break;
        case "ExpiredCodeException":
          message = "Expired code. Please request another code.";
          break;
        case "LimitExceededException":
          message =
            "You have exceeded the amount of emails which can be sent. Please try again later.";
          break;
        default:
          message = err.message;
      }
      openSnackbar({
        severity: INTENT.Danger,
        message,
      });
    }
  };

  const {
    username,
    password,
    email,
    codeSent,
    destination,
    code,
    codeLoading,
    createLoading,
  } = state;
  return (
    <Dialog
      open={isOpen}
      onClose={(): void => {
        setState(initialState);
        onClose();
      }}
      className={classes.container}
    >
      <DialogTitle>Create a new account</DialogTitle>
      <DialogContent>
        {codeSent ? (
          <>
            <Typography variant="body2" style={{ marginBottom: 10 }}>
              A verification code has been sent to {destination}. Please enter this code
              below to verify your identity.
            </Typography>
            <Grid container direction="row" spacing={1}>
              <Grid item sm={6} xs={12}>
                <TextField
                  defaultValue={username.value}
                  disabled
                  fullWidth
                  label="Username"
                  variant="filled"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Verification Code"
                  variant="outlined"
                  fullWidth
                  value={code}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    setState({
                      ...state,
                      code: e.target.value,
                    })
                  }
                  helperText={
                    <div
                      className={classes.forgot}
                      tabIndex={0}
                      role="button"
                      style={{ width: "220px" }}
                      onClick={handleResendVerificationCode}
                    >
                      Not got a code? Resend code here.
                    </div>
                  }
                />
              </Grid>
            </Grid>
            <div className={classes.buttonContainer}>
              <Button
                className={classes.button}
                color="secondary"
                onClick={(): void => {
                  setState(initialState);
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button
                className={classes.button}
                color="primary"
                onClick={(): void => {
                  setState({ ...state, codeLoading: true });
                  handleVerifyCode();
                }}
              >
                {codeLoading ? <CircularProgress size={20} /> : "Create Account"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <Typography variant="body2" style={{ marginBottom: 10 }}>
              Please fill out all of the fields below to create an account.
            </Typography>
            <Grid container direction="row" spacing={1} style={{ marginBottom: "2px" }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Username"
                  helperText={username.error}
                  error={!!username.error}
                  variant="outlined"
                  fullWidth
                  value={username.value}
                  color={username.error ? "secondary" : "primary"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    setState({
                      ...state,
                      username: {
                        value: e.target.value,
                        error: "",
                      },
                    })
                  }
                  style={{ marginRight: "8px" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <PasswordInput
                  value={password.value}
                  error={password.error}
                  setValue={(value): void => {
                    setState({ ...state, password: { value, error: "" } });
                  }}
                />
              </Grid>
            </Grid>
            <TextField
              label="Email"
              color={email.error ? "secondary" : "primary"}
              helperText={email.error}
              value={email.value}
              error={!!email.error}
              variant="outlined"
              type="email"
              fullWidth
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setState({
                  ...state,
                  email: {
                    value: e.target.value,
                    error: "",
                  },
                })
              }
              style={{ marginBottom: "10px" }}
            />
            <DialogActions>
              <Button
                className={classes.button}
                color="secondary"
                onClick={(): void => {
                  setState(initialState);
                  onClose();
                }}
                style={{ marginRight: "5px" }}
              >
                Cancel
              </Button>
              <Button
                className={classes.button}
                color="primary"
                onClick={(): void => {
                  setState({ ...state, createLoading: true });
                  handleErrorCheck();
                }}
                style={{ marginLeft: "5px" }}
              >
                {createLoading ? <CircularProgress size={20} /> : "Create Account"}
              </Button>
            </DialogActions>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateAccountDialog;
