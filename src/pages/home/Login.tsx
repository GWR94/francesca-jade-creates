import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import {
  Button,
  TextField,
  CircularProgress,
  Dialog,
  makeStyles,
  Typography,
  useMediaQuery,
  Divider,
  IconButton,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import ChangePasswordDialog from "./components/ChangePasswordDialog";
import { openSnackbar } from "../../utils/Notifier";
import CreateAccountDialog from "./components/CreateAccountDialog";
import { LoginProps, LoginState } from "./interfaces/Login.i";
import PasswordInput from "../../common/inputs/PasswordInput";
import styles from "./styles/login.style";
import { breakpoints, INTENT } from "../../themes";
import VerifyDialog from "./components/VerifyDialog";

const Login: React.FC<LoginProps> = ({
  showButton = false,
  props,
  closeNav,
}): JSX.Element => {
  const [state, setState] = useState<LoginState>({
    username: "",
    password: "",
    passwordDialogOpen: false,
    accountDialogOpen: false,
    verifyDialogOpen: false,
    loggingIn: false,
  });

  const fullscreen = useMediaQuery(breakpoints.only("xs"));

  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const [isOpen, setOpen] = useState(false);

  const closeDialog = (): void => setOpen(false);

  const handleSignIn = async (): Promise<void> => {
    const { username, password } = state;
    setState({ ...state, loggingIn: true });
    try {
      await Auth.signIn(username, password);
      closeNav?.();
      closeDialog();
    } catch (err) {
      if (err.code === "UserNotConfirmedException") {
        return setState({ ...state, loggingIn: false, verifyDialogOpen: true });
      }
      openSnackbar({
        severity: INTENT.Danger,
        message: err.message,
      });
    }
    setState({ ...state, loggingIn: false });
  };

  const handleFormSubmit = (e: KeyboardEvent): void => {
    if (e.code === "Enter") handleSignIn();
  };

  useEffect((): (() => void) => {
    const passwordInput = document.getElementById("password");
    passwordInput?.addEventListener("keyup", handleFormSubmit);
    return (): void => passwordInput?.removeEventListener("keyup", handleFormSubmit);
  }, []);

  const { classOverride, text, Icon } = props;

  const {
    username,
    password,
    passwordDialogOpen,
    accountDialogOpen,
    verifyDialogOpen,
    loggingIn,
  } = state;
  return (
    <>
      {showButton ? (
        <div
          className={classes.buttonContainer}
          style={{ justifyContent: props?.align ?? "center" }}
        >
          <Button
            variant={props?.variant ?? "contained"}
            color={props?.color ?? "inherit"}
            className={classOverride || classes.button}
            disableElevation
            onClick={(): void => setOpen(true)}
          >
            {Icon && Icon}
            {text ?? "Login to Continue"}
          </Button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={(): void => setOpen(true)}
          className={classOverride || classes.button}
        >
          {Icon && Icon}
          {text}
        </div>
      )}
      <Dialog open={isOpen} onClose={closeDialog} fullScreen={fullscreen}>
        <div className={classes.container}>
          {fullscreen && (
            <IconButton
              className={classes.closeIcon}
              onClick={(): void => {
                closeNav?.();
                closeDialog();
              }}
            >
              <Close />
            </IconButton>
          )}
          <div className={classes.federated}>
            <div>
              <Typography className={classes.title}>Login with Social Media</Typography>
              <Typography className={classes.subtitle}>
                We will never post to any of your accounts or store your data.
              </Typography>
            </div>
            <div className={classes.federatedButtons}>
              <Button
                className={`${classes.button} ${classes.google}`}
                size="small"
                startIcon={<i className={`fab fa-google ${classes.icon}`} />}
                style={{ marginBottom: "10px" }}
                onClick={async (): Promise<void> => {
                  // @ts-ignore
                  await Auth.federatedSignIn({
                    provider: "Google",
                  });
                  closeNav?.();
                  closeDialog();
                }}
              >
                Login with Google
              </Button>
              <Button
                className={`${classes.button} ${classes.facebook}`}
                size="small"
                style={{ marginBottom: "10px" }}
                startIcon={<i className={`fab fa-facebook-f ${classes.icon}`} />}
                onClick={async (): Promise<void> => {
                  // @ts-ignore
                  await Auth.federatedSignIn({
                    provider: "Facebook",
                  });
                  closeNav?.();
                  closeDialog();
                }}
              >
                Login with Facebook
              </Button>
              <Button
                className={`${classes.button} ${classes.amazon}`}
                size="small"
                startIcon={<i className={`fab fa-amazon ${classes.icon}`} />}
                onClick={async (): Promise<void> => {
                  // @ts-ignore
                  await Auth.federatedSignIn({
                    provider: "LoginWithAmazon",
                  });
                  closeNav?.();
                  closeDialog();
                }}
              >
                Login with Amazon
              </Button>
            </div>
          </div>
          <div className={classes.divider}>
            <Divider />
            <Typography className={classes.orText}>or login below</Typography>
          </div>
          <div className={classes.cognito}>
            <div>
              <Typography className={classes.title}>
                Login with your credentials
              </Typography>
              <Typography className={classes.subtitle}>
                Please login with your user credentials, or create a new account.
              </Typography>
            </div>
            <div className={classes.login}>
              <TextField
                variant="outlined"
                value={username}
                onChange={(e): void => setState({ ...state, username: e.target.value })}
                label="Username"
                style={{ marginBottom: "10px" }}
              />
              <PasswordInput
                value={password}
                setValue={(password): void => setState({ ...state, password })}
              />
              <div
                className={classes.forgotText}
                tabIndex={0}
                role="button"
                onClick={(): void => setState({ ...state, passwordDialogOpen: true })}
              >
                Forgot your password?
              </div>
              <Button variant="contained" color="primary" onClick={handleSignIn}>
                {loggingIn ? <CircularProgress color="inherit" size={20} /> : "Login"}
              </Button>
              <div
                className={classes.createText}
                tabIndex={0}
                role="button"
                onClick={(): void => setState({ ...state, accountDialogOpen: true })}
              >
                Not got an account? Create one here.
              </div>
            </div>
          </div>
        </div>
        <ChangePasswordDialog
          isOpen={passwordDialogOpen}
          onClose={(): void => setState({ ...state, passwordDialogOpen: false })}
        />
        <CreateAccountDialog
          isOpen={accountDialogOpen}
          onClose={(): void => setState({ ...state, accountDialogOpen: false })}
        />
        <VerifyDialog
          username={username}
          isOpen={verifyDialogOpen}
          onClose={(): void => setState({ ...state, verifyDialogOpen: false })}
        />
      </Dialog>
    </>
  );
};

export default Login;
