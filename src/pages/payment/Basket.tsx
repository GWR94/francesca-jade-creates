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
  CircularProgress,
  useMediaQuery,
  StepIcon,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import {
  ArrowRightAltRounded,
  CheckOutlined,
  CheckRounded,
  InfoOutlined,
  WarningOutlined,
} from "@material-ui/icons";
import { AppState } from "../../store/store";
import BasketItem from "./components/BasketItem";
import Loading from "../../common/Loading";
import NonIdealState from "../../common/containers/NonIdealState";
import { openSnackbar } from "../../utils/Notifier";
import styles from "./styles/basket.style";
import { CustomOptionArrayType, BasketProps, BasketState } from "./interfaces/Basket.i";
import * as actions from "../../actions/basket.actions";
import * as userActions from "../../actions/user.actions";
import { COLORS, INTENT } from "../../themes";
import { createOrder, updateOrder } from "../../graphql/mutations";
import { UserState } from "../../reducers/user.reducer";
import { getUser, getOrder } from "../../graphql/queries";
import { BasketState as BasketStoreState } from "../../reducers/basket.reducer";
import { getCompressedKey, getPublicS3URL, removeEmojis } from "../../utils/index";
import Login from "../home/Login";

let stripePromise: Promise<Stripe | null>;
if (process.env.NODE_ENV === "production") {
  stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY_TEST as string); // FIXME - Change to regular key after testing
} else {
  stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY_TEST as string);
}

/**
 * TODO
 * [ ] Remove "Uploaded Image" text when theres no images uploaded
 * [ ] Test to see if you can remove skip button / notify user they have to skip
 * [ ] Fix session not showing up instantly (isLoading)
 * [x] Check basket clears once purchase is complete
 */

const initialState = {
  isSubmitting: false,
  user: null,
  activeStep: 0,
  currentIdx: 0,
  session: null,
  order: null,
};

/**
 * Functional component that allows a customer to check, validate, confirm
 * customisable features, and then purchase the products that they currently
 * have in their basket via Stripe. Once the user has completed their purchase
 * they will be redirected back to this page with a confirmation message (or
 * failure if there was any payment errors).
 * @param userAttributes - Object containing relevant data for the user such
 * as their sub (id), email address, phone number etc.
 */
const Basket: React.FC<BasketProps> = (): JSX.Element => {
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
  const { id } = useSelector(({ user }: AppState): UserState => user);

  const [isLoading, setLoading] = useState(true);
  const [isCancelled, setCancelled] = useState(false);

  // create state for the product and initialise it with blank input values
  const [state, setState] = useState<BasketState>(initialState);

  const isMobile = useMediaQuery("(max-width: 600px)");

  // store the useDispatch hook into a variable so it can be used within the component
  const dispatch = useDispatch();
  // store the useHistory hook into a variable so it can be used to navigate
  const history = useHistory();

  /**
   * Function to retrieve the current authenticated users' data from the
   * database, and store it into state as "user".
   */
  const getUserInfo = async (): Promise<void> => {
    // use the getUser graphQL query with the users' id to retrieve the data
    const { data } = await API.graphql(graphqlOperation(getUser, { id }));
    // store it in state and remove loading UI effects
    setState({ ...state, user: data.getUser });
  };

  useEffect(() => {
    setLoading(true);
    const handleRetrieveSession = async (sessionId: string): Promise<void> => {
      const { session } = await API.post("orderlambda", "/orders/retrieve-session", {
        body: { id: sessionId },
      });
      const { orderId } = session.metadata;
      const { data } = await API.graphql(graphqlOperation(getOrder, { id: orderId }));
      setState({
        ...state,
        session,
        activeStep: session.payment_status === "paid" ? 3 : -1,
        order: data.getOrder,
      });
      setLoading(false);
      // remove session id from url
      return window.history.pushState({}, document.title, window.location.pathname);
    };

    const { user } = state;

    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");
    const cancelled = Boolean(urlParams.get("cancel"));
    // if (!user) {
    //   // get the users' data and set it into state within the getUserInfo function
    //   getUserInfo(); //FIXME - Test
    // }
    if (!user) getUserInfo();
    if (sessionId) {
      dispatch(actions.clearCheckout());
      handleRetrieveSession(sessionId);
    } else if (cancelled) {
      setCancelled(true);
      window.history.pushState({}, document.title, window.location.pathname);
      setLoading(false);
    } else {
      // clear the checkout basket when the user navigates to the page to clear up old data
      dispatch(actions.clearCheckout());
      setState({ ...state, user: null });
      setLoading(false);
    }
  }, []);

  /**
   * Function to handle the creation of a checkout session via stripe checkout.
   * The function takes the current user's checked-out basket with all of it's
   * data, and creates a checkout session where the user can complete payment.
   */
  const handleCreateCheckout = async (): Promise<void> => {
    const { user } = state;
    if (!user) await getUserInfo();

    const { attributes } = await Auth.currentAuthenticatedUser();

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
        customOptions: (product.customOptions as CustomOptionArrayType).map((options) =>
          JSON.stringify(options),
        ),
      }));

      const params = {
        body: {
          products: updatedProducts.map((product) => ({
            ...product,
            /**
             * First, get the compressed key for product.image.key, as you don't need
             * the full resolution image. Then use that compressed key to get a signed
             * S3 url, so it can be shown within stripe's checkout.
             */
            image: getPublicS3URL({
              key: getCompressedKey(product.image.key),
              bucket: process.env.IMAGE_S3_BUCKET as string,
              region: "eu-west-2",
            }),
          })),
          email: attributes.email,
          orderId,
        },
      };

      /**
       * if there was no issue with the mutation, execute the lambda function
       * which creates a checkout session so the user can purchase their items.
       */
      const response = await API.post(
        "orderlambda",
        "/orders/create-checkout-session",
        params,
      );

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
        orderUserId: id, // use the users id (sub) so orders are linked to the user
        paymentStatus: "unpaid",
        orderProcessed: false,
        shippingAddress: {
          city: "",
          country: "",
          address_line1: "",
          address_line2: "",
          address_postcode: "",
        },
        stripeOrderId: response.id,
        userInfo: {
          emailAddress: attributes.email,
          name: user?.username ?? attributes.email,
        },
      };

      // execute the createOrder mutation with the input as the parameter.
      await API.graphql(graphqlOperation(createOrder, { input }));

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
    const { currentIdx, activeStep, isSubmitting, user } = state;
    switch (stepIndex) {
      /**
       * the first step is the user confirms the products in their basket,
       * and confirm the custom options for them.
       */
      case 0: {
        return (
          <>
            <Typography
              variant="subtitle1"
              style={{ margin: isMobile ? "10px 0" : "20px 0", lineHeight: 1.2 }}
            >
              Please confirm each of the items in your basket, and if necessary choose the
              variant you wish to purchase.
            </Typography>
            <Typography
              variant="subtitle2"
              style={{ margin: isMobile ? "10px 0" : "20px 0", lineHeight: 1.2 }}
            >
              All fields are required unless marked otherwise.
            </Typography>
            <div className={classes.itemContainer}>
              <Typography style={{ marginBottom: 4 }}>
                Confirm product <strong>{currentIdx + 1}</strong> of {basketItems.length}:
              </Typography>
              <BasketItem
                item={basketItems[currentIdx]}
                currentIdx={currentIdx}
                items={basketItems}
                setIndex={(idx: number): void => setState({ ...state, currentIdx: idx })}
              />
              <div className={classes.stepButtonContainer}>
                {!id ? (
                  <Login
                    showButton
                    props={{
                      // @ts-ignore
                      classOverride: classes.button,
                      text: "Login to Continue",
                      variant: "contained",
                      align: "center",
                      color: "primary",
                    }}
                  />
                ) : (
                  <>
                    <Button
                      onClick={(): void => {
                        setState({ ...state, activeStep: activeStep - 1 });
                      }}
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
                      variant="contained"
                      className={classes.button}
                      color="primary"
                    >
                      Next Step
                    </Button>
                  </>
                )}
              </div>
            </div>
          </>
        );
      }
      case 1: {
        return (
          <div className={classes.itemContainer}>
            <Typography variant="h4">Confirm Products</Typography>
            <Typography variant="subtitle1" style={{ margin: "10px auto 20px" }}>
              Please confirm the items in your checkout basket, and make any changes if
              necessary.
            </Typography>
            {products.map((product, i) => (
              <div className={classes.checkoutContainer} key={i}>
                <Typography variant="body1">
                  {i + 1}. {product.title}
                </Typography>
                <Typography
                  variant="caption"
                  style={{ color: COLORS.TextGray, marginLeft: 20 }}
                >
                  £{product.variant!.price.item.toFixed(2)} + £
                  {product.variant!.price.postage.toFixed(2)} P&P
                </Typography>
              </div>
            ))}
            <Typography style={{ fontWeight: "bold", marginBottom: 30 }}>
              TOTAL: £{cost.toFixed(2)}
            </Typography>
            <div className={classes.stepButtonContainer}>
              {!user ? (
                <Login
                  showButton
                  props={{
                    // @ts-ignore
                    classOverride: classes.button,
                    text: "Login to Continue",
                    variant: "contained",
                    align: "center",
                    color: "primary",
                  }}
                />
              ) : (
                <>
                  <Button
                    onClick={(): void =>
                      setState({ ...state, activeStep: activeStep - 1 })
                    }
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
                    {isSubmitting ? (
                      <CircularProgress
                        color="inherit"
                        style={{ color: "#fff" }}
                        size={20}
                      />
                    ) : (
                      "Purchase Items"
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        );
      }
      case 3: {
        const { session, order } = state;
        return (
          <div className={classes.successContainer}>
            <div className={classes.iconContainer}>
              <CheckRounded color="inherit" style={{ color: "green" }} />
            </div>
            <Typography variant="h5">
              Thanks {session.shipping.name.split(" ")[0]}!
            </Typography>
            <Typography variant="h5" gutterBottom>
              Your purchase was successful.
            </Typography>
            <Typography variant="subtitle1" style={{ margin: "12px auto" }}>
              You should receive a confirmation email at {session.customer_email} shortly.
            </Typography>
            <Typography variant="h6" style={{ textAlign: "left" }}>
              Items Purchased:
            </Typography>
            {order?.products.map(({ title, variant: { price } }) => {
              const updatedTitle = removeEmojis(title);
              return (
                <div className={classes.listContainer}>
                  <ArrowRightAltRounded className={classes.icon} />
                  <div className={classes.list}>
                    <Typography className={classes.listTitle}>{updatedTitle}</Typography>
                    <Typography className={classes.listPrice}>
                      £{price.item.toFixed(2)} + £{price.postage.toFixed(2)} P&P
                    </Typography>
                  </div>
                </div>
              );
            })}
            <Typography className={classes.listTotal} gutterBottom>
              TOTAL: £{(session.amount_total / 100).toFixed(2)}
            </Typography>
            <Button
              variant="outlined"
              color="inherit"
              onClick={(): void => {
                dispatch(userActions.setCurrentTab("orders"));
                history.push("/account");
              }}
              className={classes.trackButton}
            >
              Track Order
            </Button>
          </div>
        );
      }
      default:
        return null;
    }
  };

  const steps = ["Add Custom Options", "Purchase Items", "Purchase Completed"];
  const { activeStep, order } = state;
  return (
    <div className="content-container">
      {isLoading ? (
        <Loading size={80} />
      ) : (
        <div className={classes.container}>
          <Typography variant="h4" style={{ marginTop: 10 }}>
            Shopping Basket
          </Typography>
          {isCancelled ? (
            <div className={classes.cancelContainer}>
              <div>
                <WarningOutlined
                  color="error"
                  fontSize="large"
                  style={{
                    display: "block",
                    margin: "0 auto 10px",
                    height: 50,
                    width: 50,
                  }}
                />
                <Typography variant="h5" gutterBottom>
                  Purchase cancelled
                </Typography>
                <Typography variant="h6" gutterBottom>
                  You have not been charged.
                </Typography>
              </div>
              <Typography variant="subtitle1">
                Your items are still in the basket if you wish to continue with the
                purchase.
              </Typography>
              <Button onClick={(): void => window.location.reload()} variant="outlined">
                Go to Items
              </Button>
            </div>
          ) : basketItems.length > 0 || order ? (
            <>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, i) => (
                  <Step key={i}>
                    <StepLabel
                      StepIconProps={{
                        classes: { root: classes.stepRoot },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              <div style={{ height: "100%", width: "100%" }}>
                {getStepContent(activeStep)}
              </div>
            </>
          ) : (
            <div className={classes.nonIdealContainer}>
              <NonIdealState
                title="No items in basket"
                Icon={<InfoOutlined style={{ height: 40, width: 40 }} />}
                subtext="Please add items to the basket to see them in here"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Basket;
