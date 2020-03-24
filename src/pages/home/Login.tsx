import React from "react";
import { Col, Row } from "reactstrap";
import { Auth } from "aws-amplify";
import { FormGroup, InputGroup, Button } from "@blueprintjs/core";
import ChangePasswordDialog from "./components/ChangePasswordDialog";
import { Toaster } from "../../utils";
import CreateAccountDialog from "./components/CreateAccountDialog";
import PasswordInput from "../../common/PasswordInput";
import { LoginProps, LoginState, ICredentials } from "./interfaces/Login.i";

declare enum CognitoHostedUIIdentityProvider {
  Cognito = "COGNITO",
  Google = "Google",
  Facebook = "Facebook",
  Amazon = "LoginWithAmazon",
}
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
          <Row className="login__container">
            <Col sm={6} className="login__federated-container">
              <div className="login__text" style={{ marginBottom: "30px" }}>
                <h3 className="login__title">Login with Social Media</h3>
                <p>We will never post to any of your accounts.</p>
              </div>
              <div className="login__federated-buttons">
                <Button
                  className="login__google"
                  large
                  icon={<i className="fab fa-google" />}
                  onClick={async (): Promise<ICredentials> =>
                    // @ts-ignore
                    Auth.federatedSignIn({
                      provider: "Google",
                    })
                  }
                  text="Continue with Google"
                />
                <Button
                  className="login__facebook"
                  large
                  icon={<i className="fab fa-facebook-f" />}
                  onClick={async (): Promise<ICredentials> =>
                    // @ts-ignore
                    Auth.federatedSignIn({
                      provider: "Facebook",
                    })
                  }
                  text="Continue with Facebook"
                />
                <Button
                  className="login__amazon"
                  large
                  icon={<i className="fab fa-amazon" />}
                  onClick={async (): Promise<ICredentials> =>
                    // @ts-ignore
                    Auth.federatedSignIn({
                      provider: "LoginWithAmazon",
                    })
                  }
                  text="Continue with Amazon"
                />
              </div>
            </Col>
            <Col sm={6} className="login__cognito-container">
              <div className="login__text">
                <h3 className="login__title">Login with your account</h3>
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
            </Col>
          </Row>
        </div>
        <ChangePasswordDialog
          isOpen={passwordDialogOpen}
          onClose={(): void => this.setState({ passwordDialogOpen: false })}
        />
        <CreateAccountDialog
          isOpen={accountDialogOpen}
          onClose={(): void => this.setState({ accountDialogOpen: false })}
        />
      </>
    );
  }
}

export default Login;
