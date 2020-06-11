import React from "react";
import {
  Dialog,
  TextField,
  Button,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@material-ui/core";
import { Auth } from "aws-amplify";
import Notifier, { openSnackbar } from "../../../utils/Notifier";

import PasswordInput from "../../../common/PasswordInput";
import { PasswordProps, PasswordState } from "../interfaces/PasswordChange.i";

/**
 * TODO
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
        openSnackbar({
          severity: "success",
          message: "Successfully changed password.",
        });
      }
    } catch (err) {
      openSnackbar({
        severity: "error",
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
      <>
        <Dialog className="password__container" open={open} onClose={closeDialog}>
          <DialogTitle>Change your Password</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1">
              Please enter your old password, and set a new password below.
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <PasswordInput
                  value={oldPassword}
                  error={oldPasswordError}
                  setValue={(oldPassword): void =>
                    this.setState({ oldPassword, error: "" })
                  }
                  label="Old Password"
                  labelWidth={90}
                  placeholder="Enter old password..."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <PasswordInput
                  value={newPassword}
                  error={error || newPasswordError}
                  setValue={(newPassword): void =>
                    this.setState({ newPassword, error: "" })
                  }
                  label="New Password"
                  labelWidth={95}
                  placeholder="Enter new password..."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  className="profile__input"
                  value={repeatPassword}
                  label="Repeat Password"
                  placeholder="Repeat new password..."
                  onChange={(e): void =>
                    this.setState({
                      repeatPassword: e.target.value,
                      error: "",
                    })
                  }
                  variant="outlined"
                  type="password"
                />
              </Grid>
            </Grid>

            <span className="password__error">{error}</span>
            <DialogActions>
              <Button color="secondary" onClick={closeDialog}>
                Cancel
              </Button>
              <Button color="primary" onClick={this.handlePasswordUpdate}>
                Change Password
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

export default PasswordChange;
