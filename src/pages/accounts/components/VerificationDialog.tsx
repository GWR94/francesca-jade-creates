import React, { useState } from "react";
import { Dialog, InputGroup, Button } from "@blueprintjs/core";
import { Auth } from "aws-amplify";
import { Toaster } from "../../../utils";

interface Props {
  open: boolean;
  closeDialog: () => void;
  user: any;
  email: any;
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
      setTimeout((): void => window.location.reload(), 3000);
    } catch (err) {
      console.error(err);
      Toaster.show({
        intent: "danger",
        message: "Error updating email, please try again.",
      });
    }
  };

  return (
    <Dialog
      className="verify__container"
      isOpen={open}
      onClose={closeDialog}
      title="Verify your email address"
    >
      <div className="verify__dialog">
        <p className="verify__text">
          Please enter the verification code sent to {email.value}
        </p>
        <InputGroup
          type="text"
          value={code}
          placeholder="Enter the verification code..."
          onChange={(e): void => setCode(e.target.value)}
        />
        <div className="verify__button-container">
          <Button
            intent="success"
            text="Verify Email"
            onClick={(): Promise<void> => handleVerificationCode("email")}
            style={{ margin: "0 4px" }}
          />
          <Button
            intent="warning"
            text="Verify Later"
            onClick={closeDialog}
            style={{ margin: "0 4px" }}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default VerificationDialog;
