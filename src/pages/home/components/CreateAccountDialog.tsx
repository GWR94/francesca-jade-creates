/* eslint-disable prefer-destructuring */
import React, { ChangeEvent } from "react";
import {
  Dialog,
  Button,
  TextField,
  Grid,
  DialogTitle,
  DialogContent,
  CircularProgress,
  createMuiTheme,
  ThemeProvider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
} from "@material-ui/core";
import validate from "validate.js";
import { Auth } from "aws-amplify";
import euroNumbers from "../../../utils/europeanCodes";
import { openSnackbar } from "../../../utils/Notifier";
import PasswordInput from "../../../common/PasswordInput";
import { CreateProps, CreateState } from "../interfaces/Create.i";

const initialState = {
  username: {
    value: "",
    error: null,
  },
  password: {
    value: "",
    error: null,
  },
  email: {
    value: "",
    error: null,
  },
  phoneNumber: {
    code: "",
    number: "",
    error: null,
  },
  codeSent: false,
  destination: null,
  code: "",
  codeLoading: false,
  createLoading: false,
};

class CreateAccountDialog extends React.Component<CreateProps, CreateState> {
  public readonly state: CreateState = initialState;

  private handleErrorCheck = (): void => {
    const { username, password, email, phoneNumber } = this.state;
    let errors = false;
    const invalidEmail = validate({ from: email.value }, { from: { email: true } });
    if (invalidEmail) {
      errors = true;
      this.setState({
        email: {
          ...email,
          error: "Please enter a valid email address.",
        },
      });
    }
    const validPhoneNumber = /^[+]?[(]?[0-9]{3}[)]?[-.]?[0-9]{3}[-.]?[0-9]{4,6}$/im.test(
      `${phoneNumber.code}${phoneNumber.number}`,
    );
    if (phoneNumber.number.length && !validPhoneNumber) {
      errors = true;
      this.setState({
        phoneNumber: {
          ...phoneNumber,
          error: "Please enter a valid phone number.",
        },
      });
    }
    const validUsername = /^[a-z0-9_-]{3,15}$/i.test(username.value);
    if (!validUsername) {
      errors = true;
      this.setState({
        username: {
          ...username,
          error:
            'Please enter a valid username. Only alphanumeric and "_" or "-" characters are allowed.',
        },
      });
    }
    if (username.value.length < 3 || username.value.length > 15) {
      this.setState({
        username: {
          ...username,
          error: "Please enter a valid username. (min 3 characters, max 15 characters)",
        },
      });
    }
    if (password.value.length < 8) {
      this.setState({
        password: {
          ...password,
          error: "Please enter a valid password. (min 8 characters)",
        },
      });
    }

    if (errors) {
      this.setState({ createLoading: false });
      openSnackbar({
        severity: "error",
        message: "Please check the highlighted fields.",
      });
      return;
    }
    this.handleCreateAccount();
  };

  private handleCreateAccount = async (): Promise<void> => {
    const { username, password, email, phoneNumber } = this.state;
    try {
      const { codeDeliveryDetails } = await Auth.signUp({
        username: username.value,
        password: password.value,
        attributes: {
          email: email.value,
          phone_number: phoneNumber.number.length
            ? `${phoneNumber.code}${phoneNumber.number}`
            : "",
        },
      });
      this.setState({
        createLoading: false,
        codeSent: true,
        destination: codeDeliveryDetails.Destination,
      });
    } catch (err) {
      this.setState({ createLoading: false });
      openSnackbar({
        severity: "error",
        message: err.message,
      });
    }
  };

  private handleResendVerificationCode = async (): Promise<void> => {
    const { username } = this.state;
    try {
      await Auth.resendSignUp(username.value);
      openSnackbar({
        severity: "success",
        message: "Verification code resent.",
      });
    } catch (err) {
      openSnackbar({
        severity: "error",
        message: "Failed to send email. Please try again.",
      });
    }
  };

  private handleVerifyCode = async (): Promise<void> => {
    const { onClose } = this.props;
    const { username, code } = this.state;

    try {
      await Auth.confirmSignUp(username.value, code);
      this.setState({
        codeLoading: false,
      });
      openSnackbar({
        severity: "success",
        message: "Account successfully created.",
      });
      onClose();
    } catch (err) {
      this.setState({
        codeLoading: false,
      });
      let message;
      switch (err.name) {
        case "AliasExistsException":
          message =
            "Email/Phone number is already being used. Please sign in with these credentials.";
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
        severity: "error",
        message,
      });
    }
  };

  public render(): JSX.Element {
    const { isOpen, onClose } = this.props;
    const {
      username,
      password,
      email,
      phoneNumber,
      codeSent,
      destination,
      code,
      codeLoading,
      createLoading,
    } = this.state;
    const { theme } = this.props;
    return (
      <Dialog
        open={isOpen}
        onClose={(): void => {
          this.setState({ ...initialState });
          onClose();
        }}
        className="dialog__container"
      >
        <DialogTitle>Create a new account</DialogTitle>
        <DialogContent>
          {codeSent ? (
            <>
              <p>
                A verification code has been sent to {destination}. Please enter this code
                below to verify your identity.
              </p>
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
                      this.setState({
                        code: e.target.value,
                      })
                    }
                    helperText={
                      <div
                        className="login__forgot"
                        tabIndex={0}
                        role="button"
                        style={{ width: "170px" }}
                        onClick={this.handleResendVerificationCode}
                      >
                        Not got a code? Resend code here.
                      </div>
                    }
                  />
                </Grid>
              </Grid>
              <div className="dialog__button-container">
                <Button
                  className="dialog__button"
                  color="secondary"
                  onClick={(): void => {
                    this.setState({ ...initialState });
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="dialog__button"
                  color="primary"
                  onClick={(): void => {
                    this.setState({ codeLoading: true });
                    this.handleVerifyCode();
                  }}
                >
                  {codeLoading ? <CircularProgress size={20} /> : "Create Account"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <p>
                Please fill out all of the fields below to create an account. All fields
                are mandatory unless stated.
              </p>
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
                      this.setState({
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
                      this.setState({ password: { value, error: "" } });
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
                  this.setState({
                    email: {
                      value: e.target.value,
                      error: "",
                    },
                  })
                }
                style={{ marginBottom: "10px" }}
              />
              <FormControl
                fullWidth
                variant="outlined"
                error={!!phoneNumber.error}
                style={{ flexDirection: "row" }}
              >
                <InputLabel>Country Code</InputLabel>
                <Select
                  value={phoneNumber.code}
                  labelWidth={114}
                  onChange={(e: any): void =>
                    this.setState({
                      phoneNumber: { ...phoneNumber, code: e.target.value },
                    })
                  }
                  style={{ width: "200px" }}
                >
                  {euroNumbers.map((num, i) => (
                    <MenuItem key={i} value={num.value}>
                      {num.label}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  variant="outlined"
                  value={phoneNumber.number}
                  label="Phone Number"
                  onChange={(e): void =>
                    this.setState({
                      phoneNumber: {
                        ...phoneNumber,
                        number: e.target.value,
                        error: "",
                      },
                    })
                  }
                  color={phoneNumber.error ? "secondary" : "primary"}
                  fullWidth
                  style={{ marginLeft: "8px" }}
                />
              </FormControl>
              <DialogActions>
                <Button
                  className="dialog__button"
                  color="secondary"
                  onClick={(): void => {
                    this.setState({ ...initialState });
                    onClose();
                  }}
                  style={{ marginRight: "5px" }}
                >
                  Cancel
                </Button>
                <Button
                  className="dialog__button"
                  color="primary"
                  onClick={(): void => {
                    this.setState({ createLoading: true });
                    this.handleErrorCheck();
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
  }
}

export default CreateAccountDialog;
