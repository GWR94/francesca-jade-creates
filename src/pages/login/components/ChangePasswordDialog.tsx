/* eslint-disable prefer-destructuring */
import React from "react";
import { Dialog, FormGroup, InputGroup, Button } from "@blueprintjs/core";
import { Auth } from "aws-amplify";
import { Row, Col } from "reactstrap";
import { Toaster } from "../../../utils";

interface PasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PasswordState {
  codeSent: boolean;
  username: string;
  code: string;
  newPassword: string;
  destination: string;
  codeLoading: boolean;
  verifyLoading: boolean;
}

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
      console.error(err);
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
      Toaster.show({
        intent: "danger",
        message,
      });
    }
  };

  private handleCodeVerify = async (): Promise<void> => {
    const { username, code, newPassword } = this.state;
    const { onClose } = this.props;
    try {
      await Auth.forgotPasswordSubmit(username, code, newPassword);
      Toaster.show({
        intent: "success",
        message: "Successfully changed password.",
      });
      this.setState({ ...initialState });
      onClose();
    } catch (err) {
      this.setState({ verifyLoading: false });
      console.error(err);
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

      Toaster.show({
        intent: "danger",
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
      <Dialog
        title="Reset your password"
        isOpen={isOpen}
        onClose={onClose}
        className="dialog__container"
      >
        <div className="dialog__inner-container">
          {codeSent ? (
            <>
              <p>
                A code has been sent to {destination}. Please enter it into the input
                below and create a new password.
              </p>
              <Row>
                <Col sm={6}>
                  <FormGroup label="Code:">
                    <InputGroup
                      value={code}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                        this.setState({ code: e.target.value })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col sm={6}>
                  <FormGroup label="New Password:">
                    <InputGroup
                      value={newPassword}
                      type="password"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                        this.setState({ newPassword: e.target.value })
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div className="dialog__button-container">
                <Button
                  intent="success"
                  onClick={(): void => {
                    this.setState({ verifyLoading: true });
                    this.handleCodeVerify();
                  }}
                  className="dialog__button"
                  loading={verifyLoading}
                >
                  Update Password
                </Button>
              </div>
            </>
          ) : (
            <>
              <p>
                Please enter the username associated with your account. You will be
                emailed a code which will let you change your password.
              </p>
              <FormGroup label="Username:">
                <InputGroup
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    this.setState({ username: e.target.value })
                  }
                />
              </FormGroup>
              <div className="dialog__button-container">
                <Button
                  intent="success"
                  onClick={(): void => {
                    this.setState({ codeLoading: true });
                    this.handleForgottenPassword();
                  }}
                  className="dialog__button"
                  text="Send Code"
                  loading={codeLoading}
                />
              </div>
            </>
          )}
        </div>
      </Dialog>
    );
  }
}

export default ChangePasswordDialog;
