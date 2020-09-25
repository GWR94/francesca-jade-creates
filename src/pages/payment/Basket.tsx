import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API, Auth, graphqlOperation, Storage } from "aws-amplify";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { v4 as uuidv4 } from "uuid";
import { InfoOutlined } from "@material-ui/icons";
import { Typography, Button, makeStyles, Grid, Hidden } from "@material-ui/core";
import { AppState } from "../../store/store";
import BasketItem from "./components/BasketItem";
import Loading from "../../common/Loading";
import { BasketState } from "../../reducers/basket.reducer";
import NonIdealState from "../../common/containers/NonIdealState";
import { openSnackbar } from "../../utils/Notifier";
import styles from "./styles/basket.style";
import { BasketItemProps, CustomOptionArrayType } from "./interfaces/Basket.i";
import * as actions from "../../actions/basket.actions";
import { INTENT } from "../../themes";
import { UserAttributeProps } from "../accounts/interfaces/Accounts.i";
import { createOrder } from "../../graphql/mutations";
import { S3ImageProps } from "../accounts/interfaces/Product.i";
import { UserState } from "../../reducers/user.reducer";

let stripePromise: Promise<Stripe | null>;
if (process.env.NODE_ENV === "production") {
  stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);
} else {
  stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY_TEST);
}
interface Props {
  userAttributes: UserAttributeProps;
}

/**
 * TODO
 * [ ] Fix image sent to stripe
 */

const Basket: React.FC<Props> = (): JSX.Element => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const {
    items,
    checkout: { cost, products },
  } = useSelector(({ basket }: AppState): BasketState => basket);
  const { id, email, emailVerified } = useSelector(
    ({ user }: AppState): UserState => user,
  );
  console.log(email, emailVerified);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isSubmitted, setSubmitted] = useState<boolean>(false);

  let isMounted = false;
  const dispatch = useDispatch();

  /**
   * A function to get the minimum possible value for the current chosen
   * product. Will also return a string to notify the customer to request
   * a quote if there is no current price.
   * @param product - the current product to get the minimum price from
   */
  const getMinPrice = (product: BasketItemProps): string => {
    // set min to infinity so everything will be smaller
    let min = Infinity;
    // iterate through the variants of the current product
    product.variants.forEach((variant) => {
      // set the min value to be the smaller value of the current min or the current variants price
      min = Math.min(variant.price.item, min);
    });
    /**
     * if min is still infinity, there is no price so notify the user that they
     * need to request a quote; otherwise show the formatted price
     */
    return min === Infinity ? "Request for Price" : `From £${min.toFixed(2)}`;
  };

  useEffect(() => {
    // isMounted is for suppressing React error for updating state on unmounted component
    isMounted = true;
    // clear the checkout basket when the user navigates to the page to clear up old data
    if (isMounted) {
      dispatch(actions.clearCheckout());
      setLoading(false);
    }
    return (): void => {
      isMounted = false;
    };
  }, []);

  /**
   * A function to convert an object of S3 data into a url which can be used
   * for an image src.
   * @param s3 {S3ImageProps} - object containing the key, region and bucket
   * data which is needed to create a src url.
   */
  const convertS3ObjectToUrl = async (
    s3: S3ImageProps,
    policy: "public" | "private" = "public",
  ): Promise<string> => {
    const { key, bucket, region } = s3 as S3ImageProps;
    const { identityId } = await Auth.currentCredentials();
    switch (policy) {
      case "public":
        return `https://${bucket}.s3.${region}.amazonaws.com/public/${identityId}/${key}`;
      case "private": {
        return `https://${bucket}.s3.${region}.amazonaws.com/private/${identityId}/${key}`;
      }
    }
  };

  /**
   * Function to handle the creation of a checkout session via stripe checkout.
   * The function takes the current user's checked-out basket with all of it's
   * data, and creates a checkout session where the user can complete payment.
   */
  const handleCreateCheckout = async (): Promise<void> => {
    try {
      // show ui loading effects
      setSubmitted(true);
      // connect to stripe via awaiting stripePromise
      const stripe = await stripePromise;
      // create a unique id for the order
      const orderId = uuidv4();

      /**
       * Create an updatedProducts variable with each of the customOptions
       * stringified so it can be passed into the database via graphql without
       * validation errors (customOptions is a string array in graphql).
       */
      const updatedProducts = products.map((product) => ({
        ...product,
        customOptions: (product.customOptions as CustomOptionArrayType).map((options) => {
          return JSON.stringify(options);
        }),
      }));

      /**
       * create an input object for creating a new order with the graphql createOrder
       * mutation. Other fields will be added to the database (such as stripePaymentIntent
       * and shippingAddress) by the server once the user completes payment (via stripeWebhook
       * lambda function)
       */
      const input = {
        id: orderId,
        products: updatedProducts,
        createdAt: new Date(),
        orderUserId: id,
        paymentStatus: "unpaid",
        shippingAddress: {
          city: "",
          country: "",
          address_line1: "",
          address_line2: "",
          address_postcode: "",
        },
      };

      // execute the createOrder mutation with the input as the parameter.
      await API.graphql(graphqlOperation(createOrder, { input }));
      /**
       * if there was no issue with the mutation, execute the lambda function
       * which creates a checkout session so the user can purchase their items.
       */
      const response = await API.post("orderlambda", "/orders/create-checkout-session", {
        body: {
          products: updatedProducts.map((product) => ({
            ...product,
            image: convertS3ObjectToUrl(product.image),
          })),
          email,
          orderId,
        },
      });
      // pass the session's id to stripe so it can be viewed by the user.
      const result = await stripe?.redirectToCheckout({
        sessionId: response.id,
      });
      // if there are any errors, notify the user.
      if (result?.error) {
        openSnackbar({
          severity: INTENT.Danger,
          message: result?.error.message ?? "Unable to create session. Please try again.",
        });
        setSubmitted(false);
      }
    } catch (err) {
      openSnackbar({
        severity: INTENT.Danger,
        message: "Unable to create session. Please try again.",
      });
      setSubmitted(false);
      console.error(err);
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className={classes.container}>
      <Typography variant="h4">Shopping Basket</Typography>
      <Typography variant="subtitle1">
        Please choose a variant for your product (if necessary), and complete all of the
        customisable features input.
      </Typography>
      <Grid container spacing={2}>
        <Grid item sm={12} md={8}>
          {items.length > 0 ? (
            <div>
              {items.map((item) => {
                const uid = uuidv4();
                return <BasketItem item={item} key={uid} />;
              })}
              <Button
                variant="outlined"
                onClick={handleCreateCheckout}
                disabled={items.length > products.length}
              >
                {isSubmitted ? "Submitting..." : "Checkout"}
              </Button>
            </div>
          ) : (
            <NonIdealState
              title="No items in basket"
              Icon={<InfoOutlined />}
              subtext="Please add items to the basket to see them in here"
            />
          )}
        </Grid>
        <Hidden smDown>
          <Grid item md={4}>
            <div className={classes.overviewContainer}>
              <Typography className={classes.title}>Checkout Overview</Typography>
              {products.length < items.length && (
                <>
                  <Typography>
                    Completed Items: {products.length}/{items.length}
                  </Typography>
                  {items.map((item, i) => {
                    return (
                      products.findIndex((product) => product.id === item.id) === -1 && (
                        <Typography key={i}>
                          {`${item.title} - ${getMinPrice(item)}`}
                        </Typography>
                      )
                    );
                  })}
                </>
              )}
              {products.length > 0 && (
                <>
                  <Typography className={classes.subtotal}>
                    Completed Subtotal ({products.length} items):{" "}
                    <span>£{cost.toFixed(2)}</span>
                  </Typography>

                  {products.map((product) => (
                    <Typography>
                      {product.title} - £{product.price.toFixed(2)} + £
                      {product.shippingCost.toFixed(2)} P&P
                    </Typography>
                  ))}
                </>
              )}
            </div>
          </Grid>
        </Hidden>
      </Grid>
    </div>
  );
};

export default Basket;
