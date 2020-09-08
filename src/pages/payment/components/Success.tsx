import React, { useEffect } from "react";

interface Props {}

const Success = (props: Props) => {
  useEffect(() => {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("session_id");
  });
  return (
    <div className="content-container">
      <h4>Thank you for your order!</h4>
      <p>Order processing...</p>
    </div>
  );
};

export default Success;
