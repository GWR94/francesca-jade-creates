import React from "react";
import { Dialog, InputGroup, Button } from "@blueprintjs/core";
import { Auth } from "aws-amplify";
import { Row, Col } from "reactstrap";
import { Toaster } from "../../../utils";
import PasswordInput from "../../../common/PasswordInput";
import { PasswordProps, PasswordState } from "../interfaces/PasswordChange.i";

/**
 * TODO
 * [x] Change error text colour
 * [ ] Test
 */

class PasswordChange extends React.Component<PasswordProps, PasswordState> {
  public readonly state: PasswordState = {
    error: "",
    oldPasswordError: "",
    newPasswordError: "",
    oldPassword: "",
    newPassword: "",
    repeatPassword: "",
  };

  private handlePasswordUpdate = async (): Promise<void> => {
    const { oldPassword, newPassword, repeatPassword } = this.state;
    let errors = false;
    if (newPassword !== repeatPassword) {
      errors = true;
      this.setState({ error: "Passwords do not match" });
    }
    if (newPassword.length < 8) {
      errors = true;
      this.setState({
        newPasswordError: "Please enter a longer password",
      });
    }
    if (newPassword.length === 0) {
      errors = true;
      this.setState({
        newPasswordError: "Please enter a new password",
      });
    }
    if (oldPassword.length === 0) {
      errors = true;
      this.setState({
        oldPasswordError: "Please enter your old new password",
      });
    }
    if (errors) return;
    try {
      const { user } = this.props;

      const res = await Auth.changePassword(user, oldPassword, newPassword);
      if (res === "SUCCESS") {
        Toaster.show({
          intent: "success",
          message: "Successfully changed password.",
        });
      }
    } catch (err) {
      Toaster.show({
        intent: "danger",
        message: "Error updating password. Please check you input the correct password.",
      });
    }
  };

  public render(): JSX.Element {
    const {
      error,
      oldPasswordError,
      newPasswordError,
      oldPassword,
      newPassword,
      repeatPassword,
    } = this.state;
    const { open, closeDialog } = this.props;

    return (
      <Dialog
        className="password__container"
        isOpen={open}
        onClose={closeDialog}
        title="Change your password"
        icon="key"
      >
        <Row className="password__dialog">
          <p>Please enter your old password, and set a new password below.</p>
          <Col xs={4} className="profile__title">
            Old Password:
          </Col>
          <Col xs={8}>
            <PasswordInput
              className="profile__input"
              value={oldPassword}
              error={oldPasswordError}
              setValue={(oldPassword): void => this.setState({ oldPassword, error: "" })}
            />
          </Col>
          <Col xs={4} className="profile__title">
            New Password:
          </Col>
          <Col xs={8}>
            <PasswordInput
              className="profile__input"
              value={newPassword}
              error={error || newPasswordError}
              setValue={(newPassword): void => this.setState({ newPassword, error: "" })}
            />
          </Col>
          <Col xs={4} className="profile__title">
            Repeat Password:
          </Col>
          <Col xs={8}>
            <InputGroup
              className="profile__input"
              intent={error ? "danger" : "none"}
              value={repeatPassword}
              onChange={(e): void =>
                this.setState({
                  repeatPassword: e.target.value,
                  error: null,
                })
              }
              type="password"
            />
          </Col>
          <span className="password__error">{error}</span>
        </Row>
        <div className="password__dialog-buttons">
          <Button
            text="Cancel"
            intent="danger"
            onClick={closeDialog}
            style={{ margin: "0 4px" }}
          />
          <Button
            text="Change Password"
            intent="success"
            onClick={this.handlePasswordUpdate}
            style={{ margin: "0 4px" }}
          />
        </div>
      </Dialog>
    );
  }
}

export default PasswordChange;
