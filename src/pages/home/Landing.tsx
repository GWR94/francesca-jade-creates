import React from "react";
import { Button } from "@blueprintjs/core";
import { History } from "history";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import header from "../../img/header.png";
import logo from "../../img/logo.png";

interface LandingProps {
  history: History;
}

const Landing: React.SFC<LandingProps> = ({ history }): JSX.Element => {
  return (
    <>
      <div className="landing__image-container">
        <img src={header} className="landing__image" alt="hand crafted mum name frame" />
      </div>
      <div className="landing__container">
        <Row className="landing__show" noGutters>
          <Col xs={6}>
            <div className="landing__top-left-box">
              <i className="fas fa-birthday-cake landing__icon" />
              <p className="landing__text">
                Delicious fully customisable cakes for every occasion. All created from
                scratch with love and care - perfect for a gift/celebration to remember.
              </p>
              <Button
                text="Explore Cakes"
                className="landing__cakes-button"
                onClick={(): void => history.push("/cakes")}
              />
            </div>
          </Col>
          <Col xs={6}>
            <div className="landing__dark-box">
              <div className="landing__review landing__text">
                <i className="fas fa-quote-left landing__quote-icon--left" />
                The cake looked and tasted amazing{" "}
                <span role="img" aria-label="heart emoji">
                  😍
                </span>{" "}
                I ordered one for my partners birthday and he loved it and so did everyone
                that tried it! Thank you so much{" "}
                <span role="img" aria-label="smile emoji">
                  😊
                </span>
                <i className="fas fa-quote-right landing__quote-icon--right" />
                <p className="landing__review-text">
                  Olivia Churcher - on{" "}
                  <Link
                    to="/cakes/104e6cd9-8e43-41ab-865d-1a367233ab43"
                    className="landing__review-link"
                  >
                    Reeses cake
                  </Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
        <div className="landing__logo-container">
          <img src={logo} alt="Francesca Jade Creates Logo" className="landing__logo" />
        </div>
        <Row className="landing__show" style={{ marginTop: "10px" }} noGutters>
          <Col xs={6}>
            <div className="landing__dark-box-alt">
              <i className="fas fa-star landing__icon" />
              <p className="landing__text">
                Personalised Prints, Frames and Cards. All handmade with love and a little
                bit of sparkle, to capture moments, share memories & celebrate loved ones{" "}
              </p>
              <Button
                text="Explore Creations"
                className="landing__creations-button"
                onClick={(): void => history.push("/creates")}
              />
            </div>
          </Col>
          <Col xs={6} style={{ marginBottom: "60px" }}>
            <div className="landing__review-alt">
              <div>
                <i className="fas fa-quote-left landing__quote-icon--left" />
                Placeholder view blah blah blah blah blah blahblah blah blahblah blah
                blahblah blah blah
                <i className="fas fa-quote-right landing__quote-icon--right" />
              </div>
              <p className="landing__review-text">
                Placeholder - on{" "}
                <Link to="" className="landing__review-link">
                  Placeholder
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Landing;
