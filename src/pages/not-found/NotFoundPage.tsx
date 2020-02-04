import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.SFC = (): JSX.Element => (
  <div className="not-found__background">
    <div className="not-found__box">
      <p className="not-found__oops">Oops!</p>
      <p className="not-found__error-text">404 - Page not found.</p>
      <p className="not-found__link">
        <Link to="/">Go home</Link>
      </p>
    </div>
  </div>
);

export default NotFoundPage;
