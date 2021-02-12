/* eslint-disable prefer-destructuring */
import React, { useState } from "react";
import {
  Dialog,
  TextField,
  Button,
  Grid,
  CircularProgress,
  DialogActions,
  DialogContentText,
  DialogContent,
  makeStyles,
  useMediaQuery,
  Typography,
  IconButton,
} from "@material-ui/core";
import { Auth } from "aws-amplify";
import { Close } from "@material-ui/icons";
import { openSnackbar } from "../../../utils/Notifier";
import PasswordInput from "../../../common/inputs/PasswordInput";
import { PasswordProps, PasswordState } from "../interfaces/Password.i";
import { breakpoints } from "../../../themes";

const initialState = {
  codeSent: false,
  code: "",
  newPassword: "",
  destination: "",
  codeLoading: false,
  verifyLoading: false,
  username: "",
};

const ChangePasswordDialog: React.FC<PasswordProps> = ({ onClose, isOpen }) => {
  const [state, setState] = useState<PasswordState>(initialState);

  const useStyles = makeStyles({
    container: {
      fontFamily: "Roboto, sans-serif",
      width: 550,
      margin: "0 auto",
      position: "relative",
      [breakpoints.down("sm")]: {
        width: "100%",
      },
    },
    buttonContainer: {
      display: "inline-flex",
      width: "100%",
      justifyContent: "center",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    icon: {
      position: "absolute",
      top: 0,
      right: 0,
    },
    title: {
      fontSize: "1.4rem",
      textAlign: "center",
      fontWeight: "bold",
      padding: "10px 0",
    },
    closeIcon: {
      position: "absolute",
      top: 0,
      right: 0,
    },
  });
  const classes = useStyles();

  const fullscreen = useMediaQuery(breakpoints.down("xs"));

  const handleForgottenPassword = async (): Promise<void> => {
    const { username } = state;
    try {
      const { CodeDeliveryDetails } = await Auth.forgotPassword(username);
      setState({
        ...state,
        codeSent: true,
        destination: CodeDeliveryDetails.Destination,
        codeLoading: false,
      });
    } catch (err) {
      setState({ ...state, codeLoading: false });
      let message;
      switch (err.name) {
        case "LimitExceededException":
          message = "Email sending limit exceeded - Please try again later.";
          break;
        case "CodeDeliveryFailureException":
          message =
            "Verification code could not be sent to your email address. Please try again.";
          break;
        case "NotAuthorizedException":
          message = "You are not authorised to complete this action.";
          break;
        case "UserNotFoundException":
          message = "Username not found. Please check and try again.";
          break;
        default:
          message = err.message;
          break;
      }
      openSnackbar({
        severity: "error",
        message,
      });
    }
  };

  const handleCodeVerify = async (): Promise<void> => {
    const { username, code, newPassword } = state;
    try {
      await Auth.forgotPasswordSubmit(username, code, newPassword);
      openSnackbar({
        severity: "success",
        message: "Successfully changed password.",
      });
      setState(initialState);
      onClose();
    } catch (err) {
      setState({ ...state, verifyLoading: false });
      let message;
      switch (err.name) {
        case "InvalidParameterException":
          message = "Password does not meet minimum standards. Please try a different";
          break;
        case "CodeMismatchException":
          message = "Invalid verification code provided. Please try again.";
          break;
        case "ExpiredCodeException":
          message =
            "The verification code has expired. Please request a new code and try again.";
          break;
        case "NotAuthorizedException":
          message = "You are not authorised to complete this action.";
          break;
        default:
          message = err.message;
          break;
      }

      openSnackbar({
        severity: "error",
        message,
      });
    }
  };

  const {
    codeSent,
    destination,
    code,
    newPassword,
    username,
    codeLoading,
    verifyLoading,
  } = state;
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className={classes.container}
      fullScreen={fullscreen}
    >
      <IconButton onClick={onClose} className={classes.closeIcon}>
        <Close />
      </IconButton>
      {codeSent ? (
        <>
          <DialogContent className={classes.content}>
            <Typography className={classes.title} gutterBottom>
              Reset Your Password
            </Typography>
            <DialogContentText>
              A code has been sent to {destination}. Please enter it into the input below
              and create a new password.
            </DialogContentText>
            <Grid container spacing={1} direction="row">
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Code"
                  variant="outlined"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    setState({ ...state, code: e.target.value })
                  }
                  fullWidth
                  value={code}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <PasswordInput
                  value={newPassword}
                  setValue={(newPassword): void => setState({ ...state, newPassword })}
                />
              </Grid>
            </Grid>
            <DialogActions>
              <Button
                color="secondary"
                onClick={(): void => setState({ ...state, codeSent: false })}
              >
                Back
              </Button>
              <Button
                color="primary"
                onClick={(): void => {
                  setState({ ...state, verifyLoading: true });
                  handleCodeVerify();
                }}
                style={{ margin: "0 5px" }}
              >
                {verifyLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Update Password"
                )}
              </Button>
            </DialogActions>
          </DialogContent>
        </>
      ) : (
        <DialogContent className={classes.content}>
          <Typography className={classes.title} gutterBottom>
            Reset Your Password
          </Typography>
          <DialogContentText>
            Please enter the username associated with your account. You will be emailed a
            code which will let you change your password.
          </DialogContentText>
          <TextField
            label="Username"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setState({ ...state, username: e.target.value })
            }
            variant="outlined"
            fullWidth
          />
          <DialogActions>
            <Button color="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={(): void => {
                setState({ ...state, codeLoading: true });
                handleForgottenPassword();
              }}
              style={{ margin: "0 5px" }}
            >
              {codeLoading ? <CircularProgress size={20} color="inherit" /> : "Send Code"}
            </Button>
          </DialogActions>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ChangePasswordDialog;
