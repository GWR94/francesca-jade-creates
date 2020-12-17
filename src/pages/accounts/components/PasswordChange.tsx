import React, { useState } from "react";
import {
  Dialog,
  TextField,
  Button,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles,
  DialogContentText,
} from "@material-ui/core";
import { Auth } from "aws-amplify";
import { openSnackbar } from "../../../utils/Notifier";

import PasswordInput from "../../../common/inputs/PasswordInput";
import { PasswordProps, PasswordState } from "../interfaces/PasswordChange.i";
import { COLORS, FONTS } from "../../../themes";

/**
 * TODO
 * [ ] Test
 */

const PasswordChange: React.FC<PasswordProps> = ({
  user,
  closeDialog,
  open,
}): JSX.Element => {
  const useStyles = makeStyles({
    container: {
      fontFamily: FONTS.Title,
    },
    dialog: {
      padding: "20px 40px",
    },
    input: {
      width: "100%",
      marginBottom: 6,
    },
    error: {
      fontSize: "1rem",
      color: COLORS.ErrorRed,
      margin: 0,
      textAlign: "center",
    },
  });
  const classes = useStyles();
  const [state, setState] = useState<PasswordState>({
    error: "",
    oldPasswordError: "",
    newPasswordError: "",
    oldPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  const handlePasswordUpdate = async (): Promise<void> => {
    const { oldPassword, newPassword, repeatPassword } = state;
    let errors = false;
    if (newPassword !== repeatPassword) {
      errors = true;
      setState({ ...state, error: "Passwords do not match" });
    }
    if (newPassword.length < 8) {
      errors = true;
      setState({ ...state, newPasswordError: "Please enter a longer password" });
    }
    if (newPassword.length === 0) {
      errors = true;
      setState({ ...state, newPasswordError: "Please enter a new password" });
    }
    if (oldPassword.length === 0) {
      errors = true;
      setState({ ...state, oldPasswordError: "Please enter your old new password" });
    }
    if (errors) return;
    try {
      const res = await Auth.changePassword(user, oldPassword, newPassword);
      if (res === "SUCCESS") {
        openSnackbar({
          severity: "success",
          message: "Successfully changed password.",
        });
        closeDialog();
      }
    } catch (err) {
      console.error(err);
      openSnackbar({
        severity: "error",
        message: "Error updating password. Please check you input the correct password.",
      });
    }
  };

  const {
    error,
    oldPasswordError,
    newPasswordError,
    oldPassword,
    newPassword,
    repeatPassword,
  } = state;

  return (
    <Dialog className={classes.container} open={open} onClose={closeDialog}>
      <DialogTitle>Change your Password</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter your old password, and set a new password below.
        </DialogContentText>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <PasswordInput
              value={oldPassword}
              error={oldPasswordError}
              setValue={(oldPassword): void =>
                setState({ ...state, oldPassword, error: "" })
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
                setState({ ...state, newPassword, error: "" })
              }
              label="New Password"
              labelWidth={95}
              placeholder="Enter new password..."
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              className={classes.input}
              value={repeatPassword}
              label="Repeat Password"
              placeholder="Repeat new password..."
              onChange={(e): void =>
                setState({ ...state, repeatPassword: e.target.value, error: "" })
              }
              variant="outlined"
              type="password"
            />
          </Grid>
        </Grid>

        <span className={classes.error}>{error}</span>
        <DialogActions>
          <Button color="secondary" onClick={closeDialog}>
            Cancel
          </Button>
          <Button color="primary" onClick={handlePasswordUpdate}>
            Change Password
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordChange;
