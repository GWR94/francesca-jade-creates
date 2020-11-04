import { Button, makeStyles, Typography } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import logo from "../../../img/logo.png";
import * as userActions from "../../../actions/user.actions";
import * as basketActions from "../../../actions/basket.actions";
import Loading from "../../../common/Loading";

const Success: React.FC = () => {
  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState<boolean>(true);
  const [isPaid, setPaid] = useState<boolean>(false);

  useEffect(() => {
    dispatch(basketActions.clearBasket());
    const url = new URL(window.location.href);
    const id = url.searchParams.get("session_id");
    const fetchSession = async (id: string | null): Promise<void> => {
      const { session } = await API.post("orderlambda", "/orders/retrieve-session", {
        body: { id },
      });
      console.log(session);
      if (session.payment_status === "paid") {
        setPaid(true);
      }
    };
    if (id) fetchSession(id);
    setLoading(false);
  }, []);

  const breakpoints = createBreakpoints({});
  const useStyles = makeStyles({
    logo: {
      height: 100,
      width: 100,
      marginBottom: 20,
    },
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "calc(100vh - 100px)",
    },
    text: {
      textAlign: "center",
      margin: "4px 12px",
      fontSize: "1.1rem",
      [breakpoints.down("sm")]: {
        fontSize: "1rem",
      },
    },
    ordersButton: {
      marginTop: 20,
    },
  });

  const classes = useStyles();
  const history = useHistory();

  return isLoading ? (
    <Loading />
  ) : (
    <div className="content-container">
      <div className={classes.container}>
        <img src={logo} className={classes.logo} alt="Francesca Jade Creates" />
        <Typography variant="h4">
          {isPaid ? "Thank you for your order!" : "Payment Error"}
        </Typography>
        {isPaid ? (
          <Typography className={classes.text}>
            Payment has been processed. You should receive an email with shipping
            confirmation soon.
          </Typography>
        ) : (
          <Typography className={classes.text}>
            There has unfortunately been an error in processing payment for your order.
          </Typography>
        )}
        <Typography className={classes.text}>
          Please check your orders from your account page to check the status of your
          order. {!isPaid ? "Please retry payment on this page." : ""}
        </Typography>
        <Button
          variant="contained"
          onClick={(): void => {
            dispatch(userActions.setCurrentTab("orders"));
            history.push("/account");
          }}
          color="primary"
          className={classes.ordersButton}
        >
          View Orders
        </Button>
      </div>
    </div>
  );
};

export default Success;
