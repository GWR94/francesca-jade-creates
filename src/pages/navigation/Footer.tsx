import { Grid, makeStyles } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import React from "react";
import { Link } from "react-router-dom";
import { COLORS, FONTS } from "../../themes";

const Footer = (): JSX.Element => {
  const breakpoints = createBreakpoints({});
  const useStyles = makeStyles({
    container: {
      borderTop: `3px solid ${COLORS.LightPink}`,
      width: "100%",
      position: "relative",
      bottom: 0,
      background: "#fff",
      fontFamily: FONTS.Title,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      zIndex: 5,
    },
    row: {
      margin: "10px auto",
      width: 600,
      [breakpoints.down("sm")]: {
        width: "80%",
      },
    },
    link: {
      textDecoration: "none",
      textAlign: "center",
      color: COLORS.DarkGrey,
      fontSize: "0.9rem",
      display: "flex",
      padding: "5px 10px",
      justifyContent: "center",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  });
  const classes = useStyles();
  return (
    <div className={`${classes.container} animate__animated animate__slideInUp`}>
      <Grid container className={classes.row} justify="center">
        <Grid item xs={12} sm={6}>
          <Link className={classes.link} to="/contact">
            Contact Us
          </Link>
          <Link className={classes.link} to="/faq">
            Frequently Asked Questions
          </Link>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Link className={classes.link} to="/terms-of-service">
            Terms of Service
          </Link>
          <Link className={classes.link} to="/privacy-policy">
            Privacy Policy
          </Link>
        </Grid>
      </Grid>
      <a
        className={classes.link}
        style={{
          fontSize: "0.7rem",
          paddingBottom: 10,
          color: COLORS.Gray,
        }}
        href="https://www.james-gower.dev/"
      >
        James Gower © 2020
      </a>
    </div>
  );
};

export default Footer;
