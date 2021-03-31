import { Button, makeStyles, Typography } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import React from "react";
import { Link, useHistory } from "react-router-dom";

const FAQ = (): JSX.Element => {
  const breakpoints = createBreakpoints({});
  const useStyles = makeStyles({
    container: {
      width: 800,
      margin: "0 auto",
      display: "block",
      paddingTop: 10,
      [breakpoints.down("sm")]: {
        width: "90%",
      },
    },
    title: {
      fontWeight: "bold",
      fontSize: "1.1rem",
      textAlign: "left",
    },
    text: {
      color: "rgba(0,0,0,0.6)",
    },
    contact: {
      width: 500,
      margin: "20px auto",
      textAlign: "center",
      [breakpoints.down("sm")]: {
        width: "100%",
      },
    },
  });

  const history = useHistory();
  const classes = useStyles();
  return (
    <div className="content-container">
      <div className={classes.container}>
        <Typography variant="h4" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="h6" style={{ textAlign: "left" }}>
          Orders
        </Typography>
        <div style={{ marginLeft: 10 }}>
          <Typography className={classes.title}>
            How can I track the status of my order?
          </Typography>
          <Typography variant="body1" gutterBottom className={classes.text}>
            To track the status of your order you must be signed in and go to your Orders
            page (from the Accounts dropdown menu), or click{" "}
            <Link to="/account?page=orders">here</Link>
          </Typography>
          <Typography className={classes.title}>
            How can do I make changes to my order?
          </Typography>
          <Typography variant="body1" gutterBottom className={classes.text}>
            If you need to make any changes to an order that has already been completed,
            please email us as soon as possible to let us know about any changes at{" "}
            <a href="mailto:contact@francescajadecreates.com">
              contact@francescajadecreates.com
            </a>
            . Any changes that are requested after a product has started being created may
            incur additional charges.
          </Typography>
          <Typography className={classes.title}>
            How do I request a personalised cake?
          </Typography>
          <Typography variant="body1" gutterBottom className={classes.text}>
            To request a personalised cake you must first view the cake that you wish to
            view, and click on the &quot;Request a Quote&quot; button, or click on the
            pink &quot;?&quot; button at the bottom of the product card. Both of these
            options will open the cake request form, which will need to be completed so we
            can respond with your quote.
          </Typography>
        </div>
        <Typography variant="h6" style={{ textAlign: "left" }}>
          Products
        </Typography>
        <div style={{ marginLeft: 10 }}>
          <Typography className={classes.title}>
            What ingredients are used to create your cakes?
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            style={{ color: "red" }}
            className={classes.text}
          >
            .......
          </Typography>
          <Typography className={classes.title}>
            What materials are used to create your frames?
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            style={{ color: "red" }}
            className={classes.text}
          >
            .......
          </Typography>
        </div>
        <Typography variant="h6" style={{ textAlign: "left" }}>
          Shipping & Orders
        </Typography>
        <div style={{ marginLeft: 10 }}>
          <Typography className={classes.title}>What is your return policy?</Typography>
          <Typography
            variant="body1"
            gutterBottom
            style={{ color: "red" }}
            className={classes.text}
          >
            .......
          </Typography>
          <Typography className={classes.title}>
            What are the shipping options?
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            style={{ color: "red" }}
            className={classes.text}
          >
            .......
          </Typography>
          <Typography className={classes.title}>What is your return policy?</Typography>
          <Typography
            variant="body1"
            gutterBottom
            style={{ color: "red" }}
            className={classes.text}
          >
            .......
          </Typography>
          <Typography className={classes.title}>Do you ship internationally?</Typography>
          <Typography variant="body1" gutterBottom className={classes.text}>
            Orders are currently only able to be taken from customers in the United
            Kingdom on this website. International orders can be taken from our Etsy site{" "}
            <a href="/">here</a>.
          </Typography>
          <Typography className={classes.title}>When will I receive my item?</Typography>
          <Typography
            variant="body1"
            gutterBottom
            style={{ color: "red" }}
            className={classes.text}
          >
            .......
          </Typography>
        </div>
        <div className={classes.contact}>
          <Typography variant="body1" className={classes.text}>
            If these FAQ&apos;s don&apos;t answer your questions, feel free to get in
            touch with us via the Contact Us page.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: 10 }}
            onClick={(): void => history.push("/contact")}
          >
            Open Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
