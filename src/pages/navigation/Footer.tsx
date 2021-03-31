import { Grid, makeStyles, Tooltip } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { COLORS, FONTS } from "../../themes";

const Footer = (): JSX.Element | null => {
  const breakpoints = createBreakpoints({});
  const useStyles = makeStyles({
    container: {
      borderTop: `3px solid ${COLORS.LightPink}`,
      width: "100%",
      position: "absolute",
      bottom: 0,
      height: 150,
      background: "#fff",
      fontFamily: FONTS.Title,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 5,
      [breakpoints.down("sm")]: {
        height: 180,
      },
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
    socialsContainer: {
      width: 200,
      margin: "0 auto 10px",
      display: "inline-flex",
      justifyContent: "space-evenly",
    },
    icon: {
      cursor: "pointer",
      fontSize: "1.6rem",
    },
  });
  const { pathname } = useLocation();
  const classes = useStyles();
  return pathname.length <= 1 ? null : (
    <div className={`${classes.container}`}>
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
      <div className={classes.socialsContainer}>
        <Tooltip title="Francesca Jade Creates Facebook" arrow>
          <i
            className={`fab fa-facebook ${classes.icon}`}
            onClick={(): void => {
              window.location.href = "https://www.facebook.com/francescajadecreates/";
            }}
            role="button"
            tabIndex={0}
          />
        </Tooltip>
        <Tooltip title="Francesca Jade Creates Instagram" arrow>
          <i
            className={`fab fa-instagram ${classes.icon}`}
            onClick={(): void => {
              window.location.href = "https://www.instagram.com/francescajadecreates/";
            }}
            role="button"
            tabIndex={0}
            style={{ color: COLORS.DarkGrey }}
          />
        </Tooltip>
        <Tooltip title="Francesca Jade Cakes Instagram" arrow>
          <i
            className={`fab fa-instagram ${classes.icon}`}
            onClick={(): void => {
              window.location.href = "https://www.instagram.com/francescajadecakes/";
            }}
            role="button"
            style={{ color: COLORS.DarkPink }}
            tabIndex={0}
          />
        </Tooltip>
        <Tooltip title="Francesca Jade Creates Etsy" arrow>
          <i
            className={`fab fa-etsy ${classes.icon}`}
            onClick={(): void => {
              window.location.href = "https://www.etsy.com/uk/shop/FrancescaJadeCreates";
            }}
            role="button"
            tabIndex={0}
          />
        </Tooltip>
      </div>
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
