import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { v4 as uuidv4 } from "uuid";
import {
  Typography,
  Button,
  makeStyles,
  Stepper,
  Step,
  StepLabel,
} from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import { AppState } from "../../store/store";
import BasketItem from "./components/BasketItem";
import Loading from "../../common/Loading";
import NonIdealState from "../../common/containers/NonIdealState";
import { openSnackbar } from "../../utils/Notifier";
import styles from "./styles/basket.style";
import { CustomOptionArrayType, BasketProps, BasketState } from "./interfaces/Basket.i";
import * as actions from "../../actions/basket.actions";
import { COLORS, INTENT } from "../../themes";
import { createOrder } from "../../graphql/mutations";
import { S3ImageProps } from "../accounts/interfaces/Product.i";
import { UserState } from "../../reducers/user.reducer";
import { getUser } from "../../graphql/queries";
import { BasketState as BasketStoreState } from "../../reducers/basket.reducer";
import { getCompressedKey, getSignedS3Url } from "../../utils/index";

let stripePromise: Promise<Stripe | null>;
if (process.env.NODE_ENV === "production") {
  stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY as string);
} else {
  stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY_TEST as string);
}

/**
 * TODO
 * [ ] Fix image sent to stripe
 * [ ] Switch yes and no buttons around for image confirm dialog
 * [ ] Fix basket
 * [ ] Fix accordion not closing/opening once completed
 */

/**
 * Functional component that allows a customer to check, validate, confirm
 * customisable features, and then purchase the products that they currently
 * have in their basket via Stripe. Once the user has completed their purchase
 * they will be redirected back to this page with a confirmation message (or
 * failure if there was any payment errors).
 * @param userAttributes - Object containing relevant data for the user such
 * as their sub (id), email address, phone number etc.
 */
const Basket: React.FC<BasketProps> = ({ userAttributes }): JSX.Element => {
  // make styles from the external styles object
  const useStyles = makeStyles(styles);
  // execute the useStyles function into a variable to use those styles
  const classes = useStyles();

  /**
   * use the useSelector hook to get access to relevant data from the basket
   * and user redux stores'
   */
  const {
    items: basketItems, // rename items to basketItems so it's clearer
    checkout: { cost, products }, // get checkout products and accumulative cost
  } = useSelector(({ basket }: AppState): BasketStoreState => basket);
  const { id, email } = useSelector(({ user }: AppState): UserState => user);

  // create state for the product and initialise it with blank input values
  const [state, setState] = useState<BasketState>({
    isLoading: true,
    isSubmitting: false,
    user: null,
    activeStep: 0,
    currentIdx: 0,
  });

  // store the useDispatch hook into a variable so it can be used within the component
  const dispatch = useDispatch();

  /**
   * Function to retrieve the current authenticated users' data from the
   * database, and store it into state as "user".
   */
  const getUserInfo = async (): Promise<void> => {
    // use the getUser graphQL query with the users' id to retrieve the data
    const { data } = await API.graphql(graphqlOperation(getUser, { id }));
    // store it in state and remove loading UI effects
    setState({ ...state, user: data.getUser, isLoading: false });
  };

  // isMounted is for suppressing React error for updating state on unmounted component
  let isMounted = false;
  useEffect(() => {
    // set isMounted to true when the component mounts
    isMounted = true;
    if (isMounted) {
      // clear the checkout basket when the user navigates to the page to clear up old data
      dispatch(actions.clearCheckout());
      // get the users' data and set it into state within the getUserInfo function
      getUserInfo();
    }
    return (): void => {
      isMounted = false;
    };
  }, []);

  /**
   * Function to handle the creation of a checkout session via stripe checkout.
   * The function takes the current user's checked-out basket with all of it's
   * data, and creates a checkout session where the user can complete payment.
   */
  const handleCreateCheckout = async (): Promise<void> => {
    const { user } = state;
    try {
      // show ui loading effects
      setState({ ...state, isSubmitting: true });
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

      if (!userAttributes) {
        // If there are no userAttributes, then the session can't be created, so notify the user
        return openSnackbar({
          severity: INTENT.Danger,
          message: "Unable to create session. Please try again.",
        });
      }
      /**
       * create an input object for creating a new order with the graphql createOrder
       * mutation. Other fields will be added to the database (such as stripePaymentIntent
       * and shippingAddress) by the server once the user completes payment (via stripeWebhook
       * lambda function)
       */
      const input = {
        id: orderId, // pass the unique orderId to be used as id
        products: updatedProducts,
        createdAt: new Date(),
        orderUserId: id, // use the
        paymentStatus: "unpaid",
        orderProcessed: false,
        shippingAddress: {
          city: "",
          country: "",
          address_line1: "",
          address_line2: "",
          address_postcode: "",
        },
        userInfo: {
          emailAddress: userAttributes.email,
          name: user?.username ?? userAttributes.email,
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
            /**
             * First, get the compressed key for product.image.key, as you don't need
             * the full resolution image. Then use that compressed key to get a signed
             * S3 url, so it can be shown within stripe's checkout.
             */
            image: getSignedS3Url(getCompressedKey(product.image.key)),
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
        setState({ ...state, isSubmitting: false });
      }
    } catch (err) {
      openSnackbar({
        severity: INTENT.Danger,
        message: "Unable to create session. Please try again.",
      });
      setState({ ...state, isSubmitting: false });
      console.error(err);
    }
  };

  const getStepContent = (stepIndex: number): JSX.Element | null => {
    const { currentIdx, activeStep } = state;
    switch (stepIndex) {
      case 0: {
        return (
          <div className={classes.itemContainer}>
            <>
              <Typography variant="subtitle1">
                Please confirm each of the items in your basket, and choose the variant
                you wish to purchase, if necessary.
              </Typography>
              <Typography style={{ marginBottom: 4 }}>
                Confirm product <strong>{currentIdx + 1}</strong> of {basketItems.length}:
              </Typography>
              <BasketItem
                item={basketItems[currentIdx]}
                currentIdx={currentIdx}
                items={basketItems}
                setIndex={(idx: number): void => setState({ ...state, currentIdx: idx })}
              />
            </>
            <div className={classes.stepButtonContainer}>
              <Button
                onClick={(): void => setState({ ...state, activeStep: activeStep - 1 })}
                color="secondary"
                variant="contained"
                disabled
                className={classes.button}
              >
                Previous Step
              </Button>
              <Button
                onClick={(): void => {
                  setState({ ...state, currentIdx: 0, activeStep: activeStep + 1 });
                }}
                disabled={basketItems.length !== products.length}
                color="primary"
                variant="contained"
                className={classes.button}
              >
                Next Step
              </Button>
            </div>
          </div>
        );
      }
      case 1: {
        return (
          <div className={classes.itemContainer}>
            <Typography variant="h4">Confirm Products</Typography>
            <Typography variant="subtitle1">
              Please confirm the items in your checkout basket, and make any changes if
              necessary.
            </Typography>
            {products.map((product, i) => (
              <div className={classes.checkoutContainer}>
                <Typography variant="body1">{product.title}</Typography>
                <Typography
                  variant="caption"
                  style={{ color: COLORS.TextGray, marginLeft: 20 }}
                >
                  £{product.price.toFixed(2)} + £{product.shippingCost.toFixed(2)} P&P
                </Typography>
              </div>
            ))}
            <Typography
              style={{ textTransform: "uppercase", fontWeight: "bold", marginBottom: 10 }}
            >
              Total: £{cost.toFixed(2)}
            </Typography>
            <div className={classes.stepButtonContainer}>
              <Button
                onClick={(): void => setState({ ...state, activeStep: activeStep - 1 })}
                color="secondary"
                variant="contained"
                disabled
                className={classes.button}
              >
                Previous Step
              </Button>
              <Button
                onClick={(): void => {
                  setState({ ...state, currentIdx: 0 });
                  handleCreateCheckout();
                }}
                disabled={basketItems.length !== products.length}
                color="primary"
                variant="contained"
                className={classes.button}
              >
                Purchase Items
              </Button>
            </div>
          </div>
        );
      }
      case 2:
        return "Purchase items";
      default:
        return null;
    }
  };

  const steps = ["Add Custom Options", "Purchase Items", "Purchase Completed"];
  const { isLoading, activeStep } = state;
  return isLoading ? (
    <Loading />
  ) : (
    <div>
      <div className={classes.container}>
        <Typography variant="h4">Shopping Basket</Typography>
        {basketItems.length > 0 ? (
          <>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div style={{ height: "100%", width: "100%" }}>
              {activeStep === steps.length ? (
                <div>
                  <Typography>All steps completed</Typography>
                  <Button onClick={(): void => setState({ ...state, activeStep: 0 })}>
                    Reset
                  </Button>
                </div>
              ) : (
                getStepContent(activeStep)
              )}
            </div>
          </>
        ) : (
          <NonIdealState
            title="No items in basket"
            Icon={<InfoOutlined />}
            subtext="Please add items to the basket to see them in here"
          />
        )}
      </div>
    </div>
  );
};

export default Basket;
