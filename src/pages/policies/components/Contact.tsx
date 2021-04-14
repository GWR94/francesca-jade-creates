import {
  Avatar,
  Button,
  Container,
  Divider,
  Grid,
  Link,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import avatar from "../../../img/avatar.png";
import { COLORS } from "../../../themes";
import ContactForm from "./ContactForm";
import styles from "../styles/contact.style";

const Contact = (): JSX.Element => {
  const useStyles = makeStyles(styles);
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
                Hi, i&apos;m ......... and I ........
              </Typography>
              <Typography className={classes.overview}>
                If you have any questions or queries, please get in touch and we&apos;ll
                be happy to help. Feel free to contact us via any of the methods below and
                we will be sure to be in touch as soon as possible.
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
                  onClick={(): string =>
                    (window.location.href =
                      "https://www.facebook.com/francescajadecreates/")
                  }
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
                  onClick={(): string =>
                    (window.location.href =
                      "https://www.instagram.com/francescajadecreates/")
                  }
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
                  onClick={(): string =>
                    (window.location.href =
                      "mailto:contact@francescajadecreates.co.uk?subject=Francesca Jade Creates Query")
                  }
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
            </Typography>
          </div>
        </div>
        <ContactForm />
      </Container>
    </div>
  );
};

export default Contact;
