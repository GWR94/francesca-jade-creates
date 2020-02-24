import React, { useState } from "react";
import { Button, Tooltip, InputGroup } from "@blueprintjs/core";

interface Props {
  value: string;
  setValue: (e) => void;
  error?: string;
  className?: string;
}

const PasswordInput: React.FC<Props> = ({ value, setValue, error, className }) => {
  const [show, setShow] = useState(false);
  const lockIcon = (
    <Tooltip content={`${show ? "Hide" : "Show"} Password`}>
      <Button
        icon={show ? "unlock" : "lock"}
        intent="warning"
        minimal
        onClick={(): void => setShow(!show)}
      />
    </Tooltip>
  );

  return (
    <InputGroup
      className={className}
      value={value}
      intent={error ? "danger" : "none"}
      type={show ? "text" : "password"}
      onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
        setValue(e.target.value)
      }
      rightElement={lockIcon}
    />
  );
};

export default PasswordInput;
