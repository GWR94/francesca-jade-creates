import React, { useState } from "react";
import {
  Dialog,
  TextField,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { Auth } from "aws-amplify";
import { Toaster } from "../../../utils";

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

  const handleVerificationCode = async (attr): Promise<void> => {
    try {
      await Auth.verifyCurrentUserAttributeSubmit(attr, code);
      Toaster.show({
        intent: "success",
        message: "Email address successfully verified",
      });
      closeDialog();
      setTimeout((): void => window.location.reload(), 3000);
    } catch (err) {
      Toaster.show({
        intent: "danger",
        message: "Error updating email, please check the code is valid.",
      });
    }
  };

  return (
    open && (
      <Dialog
        className="verify__container"
        open={open}
        onClose={closeDialog}
        title="Verify your email address"
      >
        <DialogTitle>Enter Verification Code</DialogTitle>
        <DialogContent>
          <p className="verify__text">
            Please enter the verification code sent to {email.value}
          </p>
          <TextField
            type="text"
            value={code}
            variant="outlined"
            fullWidth
            placeholder="Enter the verification code"
            onChange={(e): void => setCode(e.target.value)}
          />
          <DialogActions>
            <Button
              color="primary"
              onClick={(): Promise<void> => handleVerificationCode("email")}
              style={{ margin: "0 4px" }}
            >
              Verify Email
            </Button>
            <Button color="secondary" onClick={closeDialog} style={{ margin: "0 4px" }}>
              Verify Later
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    )
  );
};

export default VerificationDialog;
