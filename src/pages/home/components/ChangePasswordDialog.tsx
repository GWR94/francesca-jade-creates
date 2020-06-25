/* eslint-disable prefer-destructuring */
import React from "react";
import {
  DialogTitle,
  Dialog,
  TextField,
  Button,
  Grid,
  CircularProgress,
  DialogActions,
  DialogContentText,
  DialogContent,
} from "@material-ui/core";
import { Auth } from "aws-amplify";
import { openSnackbar } from "../../../utils/Notifier";
import PasswordInput from "../../../common/inputs/PasswordInput";
import { PasswordProps, PasswordState } from "../interfaces/Password.i";

const initialState = {
  codeSent: false,
  code: "",
  newPassword: "",
  destination: "",
  codeLoading: false,
  verifyLoading: false,
  username: "",
};

class ChangePasswordDialog extends React.Component<PasswordProps, PasswordState> {
  public readonly state: PasswordState = {
    ...initialState,
  };

  private handleForgottenPassword = async (): Promise<void> => {
    const { username } = this.state;
    try {
      const { CodeDeliveryDetails } = await Auth.forgotPassword(username);
      this.setState({
        codeSent: true,
        destination: CodeDeliveryDetails.Destination,
        codeLoading: false,
      });
    } catch (err) {
      this.setState({ codeLoading: false });
      let message;
      switch (err.name) {
        case "LimitExceededException":
          message = "Email sending limit succeeded - Please try again later.";
          break;
        case "CodeDeliveryFailureException":
          message =
            "Verification code could not be sent to your email address. Please try again.";
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

  private handleCodeVerify = async (): Promise<void> => {
    const { username, code, newPassword } = this.state;
    const { onClose } = this.props;
    try {
      await Auth.forgotPasswordSubmit(username, code, newPassword);
      openSnackbar({
        severity: "success",
        message: "Successfully changed password.",
      });
      this.setState({ ...initialState });
      onClose();
    } catch (err) {
      this.setState({ verifyLoading: false });
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

  public render(): JSX.Element {
    const { isOpen, onClose } = this.props;
    const {
      codeSent,
      destination,
      code,
      newPassword,
      username,
      codeLoading,
      verifyLoading,
    } = this.state;
    return (
      <>
        <Dialog open={isOpen} onClose={onClose} className="dialog__container">
          <DialogTitle>Reset Your Password</DialogTitle>
          {codeSent ? (
            <>
              <DialogContent>
                <DialogContentText>
                  A code has been sent to {destination}. Please enter it into the input
                  below and create a new password.
                </DialogContentText>
                <Grid container spacing={1} direction="row">
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Code"
                      variant="outlined"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                        this.setState({ code: e.target.value })
                      }
                      value={code}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <PasswordInput
                      value={newPassword}
                      setValue={(newPassword): void => this.setState({ newPassword })}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions className="dialog__button-container">
                <Button
                  color="primary"
                  onClick={(): void => {
                    this.setState({ verifyLoading: true });
                    this.handleCodeVerify();
                  }}
                  className="dialog__button"
                >
                  {verifyLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </DialogActions>
            </>
          ) : (
            <DialogContent>
              <DialogContentText>
                Please enter the username associated with your account. You will be
                emailed a code which will let you change your password.
              </DialogContentText>
              <TextField
                label="Username"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  this.setState({ username: e.target.value })
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
                    this.setState({ codeLoading: true });
                    this.handleForgottenPassword();
                  }}
                  className="dialog__button"
                >
                  {codeLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Send Code"
                  )}
                </Button>
              </DialogActions>
            </DialogContent>
          )}
        </Dialog>
      </>
    );
  }
}

export default ChangePasswordDialog;
