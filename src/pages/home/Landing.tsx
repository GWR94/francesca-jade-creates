import { Grid, Typography, Container, makeStyles, Button } from "@material-ui/core";
import React from "react";
import { COLORS } from "../../themes";
import cake from "../../img/cake3.svg";
import logo from "../../img/logo.png";
import styles from "./styles/landing.style";

const Landing: React.FC = (): JSX.Element => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  return (
    <Container>
      <Grid container>
        <Grid item xs={12} sm={6} className={classes.headingContainer}>
          <img src={logo} className={classes.logoImg} alt="Francesca Jade Creates" />
          <Typography className={classes.headingText}>
            Homemade Cakes & Creations, personalised{" "}
            <span style={{ color: COLORS.Pink, fontWeight: "bolder" }}>for you.</span>
          </Typography>
          <Typography className={classes.subheading}>
            Delicious homemade Cakes and personalised Creations - Perfect for any
            occasion.
          </Typography>
          <Button
            onClick={(): string => (window.location.href = "/creates")}
            className={classes.cakesButton}
            variant="contained"
          >
            Explore Creations
          </Button>
          <Button
            onClick={(): string => (window.location.href = "/cakes")}
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
