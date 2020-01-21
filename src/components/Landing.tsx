import React from "react";
import { Button } from "reactstrap";
import { H1 } from "@blueprintjs/core";
import header from "../img/header.png";
import logo from "../img/logo.png";

interface Props {}

const Landing: React.FC<Props> = (): JSX.Element => {
  return (
    <>
      <div className="landing__image-container">
        <img src={header} className="landing__image" alt="hand crafted mum name frame" />
      </div>
      <div className="landing__info">
        <H1 className="landing__title">Francesca Jade Creates</H1>

        <div className="landing__creates">
          <i className="fas fa-palette landing__creates-icon" />
          <p className="landing__text">
            Personalised hand-crafted items including cards, name frames &amp; other
            creations.
          </p>
        </div>
        <div className="landing__cakes">
          <i className="fas fa-birthday-cake landing__cakes-icon" />
          <p className="landing__text">
            Delicious home-baked cakes for every occasion. Choose the cake type and theme,
            and we&apos;ll do the rest!
          </p>
        </div>
        <div className="landing__buttons">
          <Button outline className="button__creations">
            Explore Creations
          </Button>
          <Button outline className="button__cakes">
            Explore Cakes
          </Button>
        </div>
      </div>
    </>
  );
};

export default Landing;
