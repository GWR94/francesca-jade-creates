import { Grid, Typography, Container, makeStyles, Button } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { BrushRounded, CakeRounded } from "@material-ui/icons";
import { COLORS } from "../../themes";
import cake from "../../img/cake3.svg";
import logo from "../../img/logo.png";
import styles from "./styles/landing.style";

const Landing: React.FC = (): JSX.Element => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const history = useHistory();
  return (
    <Container>
      <Grid container>
        <Grid item xs={12} sm={6} className={classes.headingContainer}>
          <img src={logo} className={classes.logoImg} alt="Francesca Jade Creates" />
          <Typography className={classes.headingText}>
            Homemade Cakes & Creations, personalised{" "}
            <span style={{ color: COLORS.DarkPink, fontWeight: "bolder" }}>for you.</span>
          </Typography>
          <BrushRounded className={classes.createsIcon} />
          <Typography className={classes.subheading}>
            Personalised Prints, Frames and Cards. All handmade with love and a little bit
            of sparkle, to capture moments, share memories & celebrate loved ones
          </Typography>
          <Button
            onClick={(): void => history.push("/creates")}
            className={classes.cakesButton}
            variant="contained"
          >
            Explore Creations
          </Button>
          <CakeRounded className={classes.cakeIcon} />
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className={classes.imageContainer}>
            <img src={cake} alt="Cake" className={classes.landingImage} />
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Landing;
