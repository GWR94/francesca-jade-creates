import React from "react";
import { Spinner } from "@blueprintjs/core";

interface Props {
  size?: number;
}

const Loading: React.FC<Props> = ({ size = 100 }): JSX.Element => {
  return (
    <div className="loading__container">
      <Spinner size={size} className="loading__spinner" />
    </div>
  );
};

export default Loading;
