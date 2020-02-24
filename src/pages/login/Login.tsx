import React from "react";
import { Container, Col, Row } from "reactstrap";
import { Auth } from "aws-amplify";
import { CognitoHostedUIIdentityProvider as Provider } from "@aws-amplify/auth/lib/types";
import { ICredentials } from "@aws-amplify/core";
import { FormGroup, InputGroup, Button, H4 } from "@blueprintjs/core";
import { History } from "history";
import ChangePasswordDialog from "./components/ChangePasswordDialog";
import { Toaster } from "../../utils";
import CreateAccountDialog from "./components/CreateAccountDialog";
import background from "../../img/background.jpg";
import PasswordInput from "../../common/PasswordInput";

interface LoginProps {
  history: History;
}

interface LoginState {
  username: string;
  password: string;
  passwordDialogOpen: boolean;
  accountDialogOpen: boolean;
}

/**
 * TODO
 * [x] Add create account
 * [x] Add option to show password on click
 * [ ] Open verification option if user is unverified
 * [ ] Fix styling for smaller devices
 */

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
      console.error(err);
      Toaster.show({
        intent: "danger",
        message: "Failed to sign in. Please check your username and password.",
      });
    }
  };

  public render(): JSX.Element {
    const { username, password, passwordDialogOpen, accountDialogOpen } = this.state;
    return (
      <div
        style={{
          background: `url(${background}) no-repeat center center fixed`,
        }}
        className="login__background"
      >
        <Container>
          <Row className="login__container">
            <Col sm={6}>
              <div className="login__federated-container">
                <div className="login__text">
                  <H4>Login with Social Media</H4>
                  <p>
                    We will never post to any of your accounts without asking you first.
                  </p>
                </div>
                <div className="login__federated-buttons">
                  <Button
                    className="login__google"
                    large
                    icon={<i className="fab fa-google" />}
                    onClick={async (): Promise<ICredentials> =>
                      Auth.federatedSignIn({ provider: Provider.Google })
                    }
                  >
                    Continue with Google
                  </Button>
                  <Button
                    className="login__facebook"
                    large
                    icon={<i className="fab fa-facebook-f" />}
                    onClick={async (): Promise<ICredentials> =>
                      Auth.federatedSignIn({ provider: Provider.Facebook })
                    }
                  >
                    Continue with Facebook
                  </Button>
                  <Button
                    className="login__amazon"
                    large
                    icon={<i className="fab fa-amazon" />}
                    onClick={async (): Promise<ICredentials> =>
                      Auth.federatedSignIn({ provider: Provider.Amazon })
                    }
                  >
                    Continue with Amazon
                  </Button>
                </div>
              </div>
            </Col>
            <Col sm={6}>
              <div className="login__cognito-container">
                <div className="login__text">
                  <h3>Login with your account</h3>
                  <p>Please login with your user credentials, or create a new account.</p>
                </div>
                <div className="login__cognito">
                  <FormGroup label="Username:">
                    <InputGroup
                      value={username}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                        this.setState({ username: e.target.value })
                      }
                    />
                  </FormGroup>
                  <FormGroup
                    label="Password:"
                    helperText={
                      <div
                        className="login__forgot"
                        tabIndex={0}
                        role="button"
                        onClick={(): void => this.setState({ passwordDialogOpen: true })}
                      >
                        Forgot your password?
                      </div>
                    }
                  >
                    <PasswordInput
                      value={password}
                      setValue={(password): void => this.setState({ password })}
                    />
                  </FormGroup>
                  <Button
                    intent="success"
                    onClick={(): Promise<void> => this.handleSignIn()}
                  >
                    Login
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
            </Col>
          </Row>
        </Container>
        <ChangePasswordDialog
          isOpen={passwordDialogOpen}
          onClose={(): void => this.setState({ passwordDialogOpen: false })}
        />
        <CreateAccountDialog
          isOpen={accountDialogOpen}
          onClose={(): void => this.setState({ accountDialogOpen: false })}
        />
      </div>
    );
  }
}

export default Login;
