import React, { useState } from "react";
import { Container, Col, Row } from "reactstrap";
import { Auth } from "aws-amplify";
import { CognitoHostedUIIdentityProvider as Provider } from "@aws-amplify/auth/lib/types";
import { ICredentials } from "@aws-amplify/core";
import {
  FormGroup,
  InputGroup,
  Button,
  H4,
  Overlay,
  H3,
  Dialog,
} from "@blueprintjs/core";
import { Toaster } from "../../../utils";
import { Authenticator } from "aws-amplify-react";

interface Props {}

class Login extends React.Component {
  public readonly state = {
    username: "",
    password: "",
    codeInput: false,
    dialogOpen: false,
  };

  private handleSignIn = async (): Promise<void> => {
    const { username, password } = this.state;
    try {
      const res = await Auth.signIn(username, password);
      console.log(res);
    } catch (err) {
      console.error(err);
      Toaster.show({
        intent: "danger",
        message: "Failed to sign in. Please check your username and password.",
      });
    }
  };

  public readonly handleForgottenPassword = async (): Promise<void> => {
    const { username, password } = this.state;
    try {
      await Auth.forgotPassword(username);
      this.setState({ codeInput: true });
    } catch (err) {
      Toaster.show({
        intent: "danger",
        message: "User not found. Please check your username.",
      });
    }
  };

  public render(): JSX.Element {
    const { username, password, dialogOpen } = this.state;
    return (
      <>
        <Container>
          <Row className="login__container">
            <Col sm={6} className="login__federated-container">
              <div className="login__text">
                <H4 className="text-center">Login with Social Media</H4>
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
            </Col>
            <Col sm={6}>
              <div className="login__cognito">
                <div className="login__text">
                  <H4>Login with your account</H4>
                  <p>Please login with your user credentials, or create a new account.</p>
                </div>
                <FormGroup label="Username">
                  <InputGroup
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                      this.setState({ username: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup
                  label="Password"
                  helperText={
                    <div
                      className="login__forgot"
                      tabIndex={0}
                      role="button"
                      onClick={(): void => this.setState({ dialogOpen: true })}
                    >
                      Forgot your password?
                    </div>
                  }
                >
                  <InputGroup
                    value={password}
                    type="password"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                      this.setState({ password: e.target.value })
                    }
                  />
                </FormGroup>
                <Button onClick={(): Promise<void> => this.handleSignIn()}>Login</Button>
              </div>
            </Col>
          </Row>
        </Container>
        <Dialog
          title="Reset your password"
          isOpen={dialogOpen}
          onClose={(): void => this.setState({ dialogOpen: false })}
          className="login__dialog-container"
        >
          <div className="login__dialog">
            <p>
              Please enter the username associated with your account. You will be emailed
              a code which will let you change your password.
            </p>
            <FormGroup label="Username">
              <InputGroup
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  this.setState({ username: e.target.value })
                }
              />
            </FormGroup>
            <Button
              intent="success"
              onClick={(): Promise<void> => this.handleForgottenPassword()}
              className="login__dialog-button"
            >
              Send Code
            </Button>
          </div>
        </Dialog>
      </>
    );
  }
}

export default Login;
