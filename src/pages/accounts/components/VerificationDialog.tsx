import React, { useState } from "react";
import {
  Dialog,
  TextField,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@material-ui/core";
import { Auth } from "aws-amplify";
import { openSnackbar } from "../../../utils/Notifier";
import { INTENT } from "../../../themes";

interface Props {
  open: boolean;
  closeDialog: () => void;
  email: {
    value: string;
  };
}

const VerificationDialog: React.FC<Props> = ({
  open,
  closeDialog,
  email,
}): JSX.Element => {
  const [code, setCode] = useState("");

  const handleVerificationCode = async (attr: string): Promise<void> => {
    try {
      await Auth.verifyCurrentUserAttributeSubmit(attr, code);
      openSnackbar({
        severity: INTENT.Success,
        message: "Email address successfully verified",
      });
      closeDialog();
      setTimeout((): void => window.location.reload(), 3000);
    } catch (err) {
      openSnackbar({
        severity: INTENT.Danger,
        message: "Error updating email. Please check the code is valid.",
      });
    }
  };

  return (
    <>
      {open && (
        <Dialog
          open={open}
          onClose={closeDialog}
          title="Verify your email address"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          <DialogTitle>Enter Verification Code</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the verification code sent to {email.value}
            </DialogContentText>
            <TextField
              type="text"
              value={code}
              variant="outlined"
              fullWidth
              placeholder="Enter the verification code"
              onChange={(e): void => setCode(e.target.value)}
            />
            <DialogActions>
              <Button color="secondary" onClick={closeDialog} style={{ margin: "0 4px" }}>
                Verify Later
              </Button>
              <Button
                color="primary"
                onClick={(): Promise<void> => handleVerificationCode("email")}
                style={{ margin: "0 4px" }}
              >
                Verify Email
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default VerificationDialog;
