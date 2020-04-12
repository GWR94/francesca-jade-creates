import React from "react";
import { Auth } from "aws-amplify";
import {
  Button,
  Grid,
  TextField,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core";
import ChangePasswordDialog from "./components/ChangePasswordDialog";
import { Toaster } from "../../utils";
import CreateAccountDialog from "./components/CreateAccountDialog";
import { LoginProps, LoginState, ICredentials } from "./interfaces/Login.i";
import PasswordInput from "../../common/PasswordInput";

const formTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#fd4ef2",
    },
    secondary: {
      main: "#D9534F",
    },
  },
});

// TODO
// [ ] Add loading for login button (HOC?)

class Login extends React.Component<LoginProps, LoginState> {
  public readonly state: LoginState = {
    username: "",
    password: "",
    passwordDialogOpen: false,
    accountDialogOpen: false,
  };

  private handleSignIn = async (): Promise<void> => {
    const { username, password } = this.state;
    const { history } = this.props;
    try {
      await Auth.signIn(username, password);
      history.push("/");
    } catch (err) {
      Toaster.show({
        intent: "danger",
        message: "Failed to sign in. Please check your username and password.",
      });
    }
  };

  public render(): JSX.Element {
    const { username, password, passwordDialogOpen, accountDialogOpen } = this.state;
    return (
      <>
        <div className="login__background">
          <div className="login__container">
            <Grid item sm={6}>
              <div className="login__federated-container">
                <div className="login__text" style={{ marginBottom: "30px" }}>
                  <h3 className="login__title">Login with Social Media</h3>
                  <p>We will never post to any of your accounts.</p>
                </div>
                <div className="login__federated-buttons">
                  <Button
                    className="login__google"
                    size="large"
                    startIcon={<i className="fab fa-google" />}
                    style={{ marginBottom: "10px" }}
                    onClick={async (): Promise<ICredentials> =>
                      // @ts-ignore
                      Auth.federatedSignIn({
                        provider: "Google",
                      })
                    }
                  >
                    Continue with Google
                  </Button>
                  <Button
                    className="login__facebook"
                    size="large"
                    style={{ marginBottom: "10px" }}
                    startIcon={<i className="fab fa-facebook-f" />}
                    onClick={async (): Promise<ICredentials> =>
                      // @ts-ignore
                      Auth.federatedSignIn({
                        provider: "Facebook",
                      })
                    }
                  >
                    Continue with Facebook
                  </Button>
                  <Button
                    className="login__amazon"
                    size="large"
                    startIcon={<i className="fab fa-amazon" />}
                    style={{ marginBottom: "10px" }}
                    onClick={async (): Promise<ICredentials> =>
                      // @ts-ignore
                      await Auth.federatedSignIn({
                        provider: "LoginWithAmazon",
                      })
                    }
                  >
                    Continue with Amazon
                  </Button>
                </div>
              </div>
            </Grid>
            <Grid item sm={6}>
              <div className="login__cognito-container">
                <div className="login__text">
                  <h3 className="login__title">Login with your account</h3>
                  <p>Please login with your user credentials, or create a new account.</p>
                </div>
                <div className="login__cognito">
                  <TextField
                    variant="outlined"
                    value={username}
                    onChange={(e): void => this.setState({ username: e.target.value })}
                    label="Username"
                    style={{ marginBottom: "10px" }}
                  />
                  <PasswordInput
                    value={password}
                    setValue={(password): void => this.setState({ password })}
                  />
                  <div
                    className="login__forgot"
                    tabIndex={0}
                    role="button"
                    onClick={(): void => this.setState({ passwordDialogOpen: true })}
                  >
                    Forgot your password?
                  </div>
                  <Button variant="contained" color="primary" onClick={this.handleSignIn}>
                    { loLogin
                  </Button>
                  <div
                    className="login__create"
                    tabIndex={0}
                    role="button"
                    onClick={(): void => this.setState({ accountDialogOpen: true })}
                  >
                    Not got an account? Create one here.
                  </div>
                </div>
              </div>
            </Grid>
          </div>
        </div>
        <ChangePasswordDialog
          isOpen={passwordDialogOpen}
          onClose={(): void => this.setState({ passwordDialogOpen: false })}
        />
        <CreateAccountDialog
          isOpen={accountDialogOpen}
          onClose={(): void => this.setState({ accountDialogOpen: false })}
          theme={formTheme}
        />
      </>
    );
  }
}

export default Login;
