import {
  Avatar,
  Button,
  Container,
  Divider,
  Grid,
  Link,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import React, { useState } from "react";
import avatar from "../../../img/avatar.png";
import { COLORS } from "../../../themes";
import ContactForm from "./ContactForm";

const Contact = (): JSX.Element => {
  const breakpoints = createBreakpoints({});

  const useStyles = makeStyles({
    avatar: {
      height: 120,
      width: 120,
      margin: "0 auto",
      border: `3px solid ${COLORS.LightGray}`,
      [breakpoints.down("sm")]: {
        margin: "0 auto 10px",
        float: "none",
      },
    },
    text: {
      textAlign: "center",
      fontStyle: "italic",
    },
    innerContainer: {
      border: `3px solid ${COLORS.LightPink}`,
      width: 200,
      height: 120,
      display: "flex",
      margin: "auto auto 10px",
      borderRadius: 15,
      padding: 16,
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    outerContainer: {
      width: 800,
      margin: "0 auto",
      [breakpoints.down("sm")]: {
        width: "80%",
      },
    },
    icon: {
      fontSize: "30px",
      fontWeight: 500,
      textAlign: "center",
      height: 30,
      width: 30,
    },
    dividerText: {
      position: "absolute",
      left: "50%",
      transform: "translateX(-90px)",
      background: "#fff",
      top: -12,
      width: 180,
      textAlign: "center",
      color: "rgba(0,0,0,0.5)",
    },
    overview: {
      fontSize: "1rem",
      textAlign: "justify",
      marginRight: 30,
      [breakpoints.down("sm")]: {
        marginRight: 0,
      },
    },
  });
  const classes = useStyles();

  return (
    <div className="content-container">
      <Container>
        <Typography variant="h4" style={{ padding: "10px 0", marginBottom: 20 }}>
          Contact Us
        </Typography>
        <div className={classes.outerContainer}>
          <Grid container alignItems="center" style={{ marginBottom: 30 }}>
            <Grid item xs={12} sm={3}>
              <Avatar alt="Francesca Jade" src={avatar} className={classes.avatar} />
            </Grid>
            <Grid item xs={12} sm={9}>
              <Typography
                className={classes.overview}
                style={{
                  marginBottom: 5,
                  color: "red",
                }}
              >
                Hi, i'm ......... and I ........
              </Typography>
              <Typography className={classes.overview}>
                If you have any questions or queries, please get in touch and we'll be
                happy to help. Feel free to contact us via any of the methods below and we
                will be sure to be in touch as soon as possible.
              </Typography>
              <Typography
                className={classes.overview}
                style={{
                  marginTop: 5,
                }}
              >
                Some questions that you may have may be answered{" "}
                <Link href="/faq">here</Link> in our Frequently Asked Questions section.
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item md={4} xs={12}>
              <div className={classes.innerContainer}>
                <i
                  className={`fab fa-facebook ${classes.icon}`}
                  style={{ color: COLORS.FacebookBlue }}
                />
                <Typography className={classes.text}>Send us a DM on Facebook</Typography>
                <Button
                  color="inherit"
                  size="small"
                  variant="outlined"
                  style={{ color: COLORS.FacebookBlue, borderColor: COLORS.FacebookBlue }}
                >
                  Open Facebook
                </Button>
              </div>
            </Grid>
            <Grid item md={4} xs={12}>
              <div className={classes.innerContainer}>
                <i
                  className={`fab fa-instagram ${classes.icon}`}
                  style={{
                    color: COLORS.InstagramPurple,
                  }}
                />
                <Typography className={classes.text}>
                  Send us a DM on Instagram
                </Typography>
                <Button
                  color="inherit"
                  style={{
                    color: COLORS.InstagramPurple,
                    borderColor: COLORS.InstagramPurple,
                  }}
                  variant="outlined"
                  size="small"
                >
                  Open Instagram
                </Button>
              </div>
            </Grid>
            <Grid item md={4} xs={12}>
              <div className={classes.innerContainer}>
                <i
                  className={`far fa-envelope-open ${classes.icon}`}
                  style={{
                    color: COLORS.ErrorRed,
                  }}
                />
                <Typography className={classes.text}>Send us an Email</Typography>
                <Button
                  color="inherit"
                  style={{ color: COLORS.ErrorRed, borderColor: COLORS.ErrorRed }}
                  size="small"
                  variant="outlined"
                >
                  Open Client
                </Button>
              </div>
            </Grid>
          </Grid>
          <div style={{ position: "relative" }}>
            <Divider style={{ margin: "30px 0" }} />
            <Typography className={classes.dividerText}>
              or fill out the form below
            </Typography>{" "}
          </div>
        </div>
        <ContactForm />
      </Container>
    </div>
  );
};

export default Contact;
