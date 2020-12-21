import { makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

const FAQ = (): JSX.Element => {
  const useStyles = makeStyles({
    container: {
      width: 800,
      margin: "0 auto",
      display: "block",
      paddingTop: 10,
    },
    title: {
      fontWeight: "bold",
      fontSize: "1.1rem",
      textAlign: "left",
    },
  });
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography variant="h4" gutterBottom>
        Frequently Asked Questions
      </Typography>
      <Typography className={classes.title}>
        How can I track the status of my order?
      </Typography>
      <Typography variant="body1" gutterBottom>
        To track the status of your order you must be signed in and go to your Orders page
        (from the Accounts dropdown menu), or click{" "}
        <Link to="/account?page=orders">here</Link>
      </Typography>
      <Typography className={classes.title}>
        How can do I make changes to my order?
      </Typography>
      <Typography variant="body1" gutterBottom>
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
      <Typography variant="body1" gutterBottom>
        To request a personalised cake you must first view the cake that you wish to view,
        and click on the &quot;Request a Quote&quot; button, or click on the pink
        &quot;?&quot; button at the bottom of the product card. Both of these options will
        open the cake request form, which will need to be completed so we can reply with
        your quote.
      </Typography>
    </div>
  );
};

export default FAQ;
