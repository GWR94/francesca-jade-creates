import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { Auth } from "aws-amplify";
import React, { useState } from "react";
import { openSnackbar } from "../../../utils/Notifier";

interface VerifyDialogProps {
  username: string;
  isOpen: boolean;
  onClose: () => void;
}

const VerifyDialog: React.FC<VerifyDialogProps> = ({
  username,
  isOpen,
  onClose,
}): JSX.Element => {
  console.log(username);
  const useStyles = makeStyles({
    resend: {
      color: "#337ab7",
      fontSize: "0.8rem",
      fontWeight: "bold",
      cursor: "pointer",
      marginBottom: 10,
      "&:hover": {
        textDecoration: "underline",
      },
    },
  });

  const classes = useStyles();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResendVerificationCode = async (): Promise<void> => {
    try {
      await Auth.resendSignUp(username);
      openSnackbar({
        severity: "success",
        message: "Verification code resent.",
      });
    } catch (err) {
      openSnackbar({
        severity: "error",
        message: "Failed to send email. Please try again.",
      });
    }
  };

  const handleVerifyUser = async (): Promise<void> => {
    try {
      setLoading(true);
      await Auth.confirmSignUp(username, code);
      setLoading(false);
      openSnackbar({
        severity: "success",
        message: "Account successfully verified.",
      });
      onClose();
    } catch (err) {
      setLoading(false);
      let message;
      switch (err.name) {
        case "AliasExistsException":
          message = "Email is already being used. Please sign in with these credentials.";
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
      openSnackbar({
        severity: "error",
        message,
      });
    }
  };
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Email Not Verified</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the verification code to proceed.
        </DialogContentText>
        <TextField
          variant="outlined"
          value={code}
          fullWidth
          label="Verification Code"
          onChange={(e): void => setCode(e.target.value)}
          helperText={
            <div
              className={classes.resend}
              tabIndex={0}
              role="button"
              style={{ width: "220px" }}
              onClick={handleResendVerificationCode}
            >
              Not got a code? Resend code here.
            </div>
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleVerifyUser} color="primary">
          {loading ? <CircularProgress size={20} /> : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerifyDialog;
