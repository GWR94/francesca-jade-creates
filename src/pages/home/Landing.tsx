import { Grid, Typography, Container, makeStyles, Button } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { BrushRounded, CakeRounded } from "@material-ui/icons";
import { COLORS } from "../../themes";
import logo from "../../img/logo.png";
import styles from "./styles/landing.style";

/**
 * Functional component to render the landing page for user. It will give a brief overview
 * of the company and buttons to navigate to Cakes or Creations pages.
 */
const Landing: React.FC = (): JSX.Element => {
  // make styles from external styles
  const useStyles = makeStyles(styles);
  // execute useStyles function and save to variable for use within component
  const classes = useStyles();
  // store useHistory into a variable so it can be used to navigate from component
  const history = useHistory();

  return (
    <Container>
      <Grid container className={classes.container}>
        <Grid item xs={12} sm={6} className={classes.headingContainer}>
          <img
            src={logo}
            className={`${classes.logoImg} animate__animated animate__fadeIn`}
            alt="Francesca Jade Creates"
          />
          <Typography
            className={`${classes.headingText} animate__animated animate__bounceIn animate__delay-half`}
          >
            Francesca Jade Creates
          </Typography>
          <Typography
            className="animate__animated animate__bounceInLeft animate__delay-1s"
            style={{ color: COLORS.DarkPink, fontWeight: "bolder", marginBottom: 30 }}
          >
            Personalised Cakes & Creations for any occasion
          </Typography>
          <div className="animate__animated animate__fadeIn animate__delay-1half">
            <div className={classes.createsContainer}>
              <BrushRounded className={classes.createsIcon} />
            </div>
            <Typography className={classes.subheading}>
              Personalised Prints, Frames and Cards. All handmade with love and a little
              bit of sparkle, to capture moments, share memories & celebrate loved ones
            </Typography>
            <Button
              onClick={(): void => history.push("/creates")}
              className={classes.cakesButton}
              variant="contained"
            >
              Explore Creations
            </Button>
            <div className={classes.cakesContainer}>
              <CakeRounded className={classes.cakeIcon} />
            </div>
            <Typography className={classes.subheading}>
              Delicious fully customisable cakes for every occasion. All created from
              scratch with love and care - perfect for a gift/celebration to remember.
            </Typography>
            <Button
              onClick={(): void => history.push("/cakes")}
              className={classes.createsButton}
              variant="contained"
            >
              Explore Cakes
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div
            className={`${classes.imageContainer} animate__animated animate__fadeIn animate__delay-2s`}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className={classes.video}
              src="https://francescajadecreatesimages102644-staging.s3.eu-west-2.amazonaws.com/public/cake_compressed.mp4"
            />
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Landing;
