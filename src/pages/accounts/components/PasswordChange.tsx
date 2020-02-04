import React from "react";
import { Dialog, InputGroup, Button } from "@blueprintjs/core";
import { Auth } from "aws-amplify";
import { Row, Col } from "reactstrap";
import { Toaster } from "../../../utils";

/**
 * TODO
 * [ ] Change error text colour
 * [ ] Test
 */

interface Props {
  user: any;
  closeDialog: () => void;
  open: boolean;
}

interface State {
  error: string;
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
}

class PasswordChange extends React.Component<Props, State> {
  public readonly state: State = {
    error: "",
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
        error: "Please enter a longer password",
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
    const { error, oldPassword, newPassword, repeatPassword } = this.state;
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
          <Col xs={4} className="profile__title">
            Old Password:
          </Col>
          <Col xs={8}>
            <InputGroup
              className="profile__input"
              value={oldPassword}
              type="password"
              onChange={(e): void =>
                this.setState({
                  oldPassword: e.target.value,
                  error: null,
                })
              }
            />
          </Col>
          <Col xs={4} className="profile__title">
            New Password:
          </Col>
          <Col xs={8}>
            <InputGroup
              className="profile__input"
              value={newPassword}
              intent={error ? "danger" : "none"}
              type="password"
              onChange={(e): void =>
                this.setState({
                  newPassword: e.target.value,
                  error: null,
                })
              }
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
