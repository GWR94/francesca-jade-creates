import React, { useState } from "react";
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
import { useHistory } from "react-router-dom";
import ChangePasswordDialog from "./components/ChangePasswordDialog";
import { openSnackbar } from "../../utils/Notifier";
import CreateAccountDialog from "./components/CreateAccountDialog";
import { LoginProps, LoginState, ICredentials } from "./interfaces/Login.i";
import PasswordInput from "../../common/inputs/PasswordInput";
import styles, { breakpoints } from "./styles/login.style";
// TODO
// [ ] Add loading for login button (HOC?)

const Login: React.FC<LoginProps> = ({ isOpen, closeDialog }): JSX.Element => {
  const [state, setState] = useState<LoginState>({
    username: "",
    password: "",
    passwordDialogOpen: false,
    accountDialogOpen: false,
    loggingIn: false,
  });

  const fullscreen = useMediaQuery(breakpoints.down("md"));

  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const history = useHistory();

  const handleSignIn = async (): Promise<void> => {
    const { username, password } = state;
    setState({ ...state, loggingIn: true });
    try {
      await Auth.signIn(username, password);
      history.push("/");
    } catch (err) {
      console.error(err);
      openSnackbar({
        severity: "error",
        message: "Failed to sign in. Please check your username and password.",
      });
    }
    setState({ ...state, loggingIn: false });
  };

  const { username, password, passwordDialogOpen, accountDialogOpen, loggingIn } = state;
  return (
    <Dialog open={isOpen} onClose={closeDialog} fullScreen={fullscreen}>
      <div className={classes.container}>
        {fullscreen && (
          <IconButton className={classes.closeIcon}>
            <Close onClick={closeDialog} />
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
              size="large"
              startIcon={<i className={`fab fa-google ${classes.icon}`} />}
              style={{ marginBottom: "10px" }}
              onClick={async (): Promise<ICredentials> =>
                // @ts-ignore
                Auth.federatedSignIn({
                  provider: "Google",
                })
              }
            >
              Login with Google
            </Button>
            <Button
              className={`${classes.button} ${classes.facebook}`}
              size="large"
              style={{ marginBottom: "10px" }}
              startIcon={<i className={`fab fa-facebook-f ${classes.icon}`} />}
              onClick={async (): Promise<ICredentials> =>
                // @ts-ignore
                Auth.federatedSignIn({
                  provider: "Facebook",
                })
              }
            >
              Login with Facebook
            </Button>
            <Button
              className={`${classes.button} ${classes.amazon}`}
              size="large"
              startIcon={<i className={`fab fa-amazon ${classes.icon}`} />}
              onClick={async (): Promise<ICredentials> =>
                // @ts-ignore
                await Auth.federatedSignIn({
                  provider: "LoginWithAmazon",
                })
              }
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
            <Typography className={classes.title}>Login with your credentials</Typography>
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
    </Dialog>
  );
};

export default Login;
