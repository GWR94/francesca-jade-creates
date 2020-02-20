/* eslint-disable prefer-destructuring */
import React from "react";
import {
  Dialog,
  FormGroup,
  InputGroup,
  ControlGroup,
  HTMLSelect,
  Button,
} from "@blueprintjs/core";
import validate from "validate.js";
import { Row, Col } from "reactstrap";
import { Auth } from "aws-amplify";
import euroNumbers from "../../../utils/europeanCodes";
import { Toaster } from "../../../utils";

interface CreateProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CreateState {
  username: {
    value: string;
    error: string;
  };
  password: {
    value: string;
    error: string;
  };
  email: {
    value: string;
    error: string;
  };
  phoneNumber: {
    code: string;
    number: string;
    error: string;
  };
  codeSent: boolean;
  destination: string;
  code: string;
  codeLoading: boolean;
  createLoading: boolean;
}

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
    code: "+44",
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
      Toaster.show({
        intent: "danger",
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
      console.error(err);
      this.setState({ createLoading: false });
      Toaster.show({
        intent: "danger",
        message: err.message,
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
      Toaster.show({
        intent: "success",
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
      Toaster.show({
        intent: "danger",
        message,
      });
      console.error(err);
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

    return (
      <Dialog
        title="Create a new account"
        isOpen={isOpen}
        onClose={(): void => {
          this.setState({ ...initialState });
          onClose();
        }}
        className="dialog__container"
      >
        <div className="dialog__inner-container">
          {codeSent ? (
            <>
              <p>
                A verification code has been sent to {destination}. Please enter this code
                below to verify your identity.
              </p>
              <Row>
                <Col sm={6}>
                  <FormGroup label="Username:">
                    <InputGroup defaultValue={username.value} disabled />
                  </FormGroup>
                </Col>
                <Col sm={6}>
                  <FormGroup
                    label="Verification Code:"
                    helperText={
                      <div
                        className="login__forgot"
                        tabIndex={0}
                        role="button"
                        style={{ width: "170px" }}
                        onClick={async (): Promise<void> => {
                          try {
                            await Auth.resendSignUp(username.value);
                            Toaster.show({
                              intent: "success",
                              message: "Verification code resent.",
                            });
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      >
                        Not got a code? Resend code here.
                      </div>
                    }
                  >
                    <InputGroup
                      value={code}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                        this.setState({
                          code: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div className="dialog__button-container">
                <Button
                  className="dialog__button"
                  intent="danger"
                  onClick={(): void => {
                    this.setState({ ...initialState });
                    onClose();
                  }}
                  text="Cancel"
                />
                <Button
                  className="dialog__button"
                  intent="success"
                  text="Create Account"
                  onClick={(): void => {
                    this.setState({ codeLoading: true });
                    this.handleVerifyCode();
                  }}
                  loading={codeLoading}
                />
              </div>
            </>
          ) : (
            <>
              <p>
                Please fill out all of the fields below to create an account. All fields
                are mandatory unless stated.
              </p>
              <Row>
                <Col sm={6}>
                  <FormGroup
                    label="Username:"
                    intent={username.error ? "danger" : "none"}
                    helperText={username.error}
                  >
                    <InputGroup
                      value={username.value}
                      intent={username.error ? "danger" : "none"}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                        this.setState({
                          username: {
                            value: e.target.value,
                            error: "",
                          },
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col sm={6}>
                  <FormGroup
                    label="Password:"
                    intent={password.error ? "danger" : "none"}
                    helperText={password.error}
                  >
                    <InputGroup
                      value={password.value}
                      type="password"
                      intent={password.error ? "danger" : "none"}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                        this.setState({
                          password: {
                            value: e.target.value,
                            error: "",
                          },
                        })
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup
                label="Email:"
                intent={email.error ? "danger" : "none"}
                helperText={email.error}
              >
                <InputGroup
                  value={email.value}
                  type="email"
                  intent={email.error ? "danger" : "none"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    this.setState({
                      email: {
                        value: e.target.value,
                        error: "",
                      },
                    })
                  }
                />
              </FormGroup>
              <FormGroup
                label="Phone Number:"
                labelInfo="(optional)"
                className="profile__input"
                intent={phoneNumber.error ? "danger" : "none"}
                helperText={phoneNumber.error}
              >
                <ControlGroup className="profile__input" fill>
                  <HTMLSelect
                    value={phoneNumber.code}
                    options={euroNumbers}
                    className="dialog__select"
                    onChange={(e): void =>
                      this.setState({
                        phoneNumber: { ...phoneNumber, code: e.target.value },
                      })
                    }
                  />
                  <InputGroup
                    intent={phoneNumber.error ? "danger" : "none"}
                    value={phoneNumber.number}
                    onChange={(e): void =>
                      this.setState({
                        phoneNumber: {
                          ...phoneNumber,
                          number: e.target.value,
                          error: "",
                        },
                      })
                    }
                  />
                </ControlGroup>
              </FormGroup>
              <div className="dialog__button-container">
                <Button
                  className="dialog__button"
                  intent="danger"
                  onClick={(): void => {
                    this.setState({ ...initialState });
                    onClose();
                  }}
                  text="Cancel"
                />
                <Button
                  className="dialog__button"
                  intent="success"
                  onClick={(): void => {
                    this.setState({ createLoading: true });
                    this.handleErrorCheck();
                  }}
                  text="Create Account"
                  loading={createLoading}
                />
              </div>
            </>
          )}
        </div>
      </Dialog>
    );
  }
}

export default CreateAccountDialog;
