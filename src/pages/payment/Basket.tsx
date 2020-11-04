import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API, Auth, graphqlOperation, Storage } from "aws-amplify";
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
import { BasketState } from "../../reducers/basket.reducer";
import NonIdealState from "../../common/containers/NonIdealState";
import { openSnackbar } from "../../utils/Notifier";
import styles from "./styles/basket.style";
import { CheckoutProductProps, CustomOptionArrayType } from "./interfaces/Basket.i";
import * as actions from "../../actions/basket.actions";
import { INTENT } from "../../themes";
import { UserAttributeProps } from "../accounts/interfaces/Accounts.i";
import { createOrder } from "../../graphql/mutations";
import { S3ImageProps } from "../accounts/interfaces/Product.i";
import { UserState } from "../../reducers/user.reducer";
import { getUser } from "../../graphql/queries";
import { ProfileProps } from "../accounts/interfaces/Profile.i";
import BasketCustomOptions from "./components/BasketCustomOptions";

let stripePromise: Promise<Stripe | null>;
if (process.env.NODE_ENV === "production") {
  stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY as string);
} else {
  stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY_TEST as string);
}
interface Props {
  userAttributes: UserAttributeProps | null;
}

/**
 * TODO
 * [ ] Fix image sent to stripe
 * [ ] Switch yes and no buttons around for image confirm dialog
 */

const Basket: React.FC<Props> = ({ userAttributes }): JSX.Element => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const {
    items,
    checkout: { cost, products },
  } = useSelector(({ basket }: AppState): BasketState => basket);
  const { id, email } = useSelector(({ user }: AppState): UserState => user);

  const [isLoading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setSubmitted] = useState<boolean>(false);
  const [user, setUser] = useState<ProfileProps | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [currentIdx, setIndex] = useState<number>(0);
  const [confirmedBasket, setConfirmedBasket] = useState<CheckoutProductProps[]>([]);

  let isMounted = false;
  const dispatch = useDispatch();

  const getUserInfo = async (): Promise<void> => {
    const { data } = await API.graphql(graphqlOperation(getUser, { id }));
    setUser(data.getUser);
  };

  useEffect(() => {
    // isMounted is for suppressing React error for updating state on unmounted component
    isMounted = true;
    // clear the checkout basket when the user navigates to the page to clear up old data
    if (isMounted) {
      dispatch(actions.clearCheckout());
      setLoading(false);
      getUserInfo();
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
        return `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`;
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

      if (!userAttributes) {
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
        id: orderId,
        products: updatedProducts,
        createdAt: new Date(),
        orderUserId: id,
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

  const getStepContent = (stepIndex: number): JSX.Element => {
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
                Confirm product <strong>{currentIdx + 1}</strong> of {items.length}:
              </Typography>
              <BasketItem
                item={items[currentIdx]}
                currentIdx={currentIdx}
                items={items}
                setIndex={setIndex}
                handleConfirmProduct={(product: CheckoutProductProps): void =>
                  setConfirmedBasket([...confirmedBasket, product])
                }
              />
            </>
            <div className={classes.stepButtonContainer}>
              <Button
                onClick={(): void => setActiveStep(activeStep - 1)}
                color="secondary"
                variant="contained"
                disabled
                className={classes.button}
              >
                Previous Step
              </Button>
              <Button
                onClick={(): void => {
                  setIndex(0);
                  setActiveStep(activeStep + 1);
                }}
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
            <Typography variant="h4">Add Custom Options</Typography>
            <BasketCustomOptions currentVariant={products[currentIdx].variant} />
          </div>
        );
      }
      case 2:
        return "Purchase items";
      default:
        return "Unknown stepIndex";
    }
  };

  const steps = ["Confirm Products", "Add Custom Options", "Purchase Items"];

  return isLoading ? (
    <Loading />
  ) : (
    <div>
      <div className={classes.container}>
        <Typography variant="h4">Shopping Basket</Typography>
        {items.length > 0 ? (
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
                  <Button onClick={(): void => setActiveStep(0)}>Reset</Button>
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
