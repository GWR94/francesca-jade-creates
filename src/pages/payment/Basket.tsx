import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API, Auth, graphqlOperation, Storage } from "aws-amplify";
import { loadStripe } from "@stripe/stripe-js";
import { v4 as uuidv4 } from "uuid";
import { InfoOutlined } from "@material-ui/icons";
import {
  Typography,
  Button,
  makeStyles,
  Grid,
  Hidden,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { AppState } from "../../store/store";
import BasketItem from "./components/BasketItem";
import { getUser } from "../../graphql/queries";
import Loading from "../../common/Loading";
import { BasketState } from "../../reducers/basket.reducer";
import NonIdealState from "../../common/containers/NonIdealState";
import { openSnackbar } from "../../utils/Notifier";
import styles from "./styles/basket.style";
import { BasketItemProps } from "./interfaces/Basket.i";
import * as actions from "../../actions/basket.actions";
import { INTENT } from "../../themes";
import { UserAttributeProps } from "../accounts/interfaces/Accounts.i";
import { createOrder } from "../../graphql/mutations";
import { UploadedFile } from "../accounts/interfaces/NewProduct.i";
import { S3ImageProps } from "../accounts/interfaces/Product.i";
import { UserState } from "../../reducers/user.reducer";
// @ts-ignore
import awsExports from "../../aws-exports";

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);

interface Props {
  userAttributes: UserAttributeProps;
}

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
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("xs"));

  let isMounted = false;
  const dispatch = useDispatch();

  /**
   * A function to get the minimum possible value for the current chosen
   * product. Will also return a string to notify the customer to request
   * a quote if there is no current price.
   * @param product - the current product to get the minimum price from
   */
  const getMinPrice = (product: BasketItemProps): string => {
    let min = Infinity;
    product.variants.forEach((variant) => {
      min = Math.min(variant.price.item, min);
    });
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
  const convertS3ObjectToUrl = (s3: S3ImageProps): string => {
    const { key, bucket, region } = s3;
    return `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`;
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
      /**
       * get the current authenticated users' identityId so it can be used
       * for a path in for S3 images in the database.
       */
      const { identityId } = await Auth.currentCredentials();
      // create a unique id for the order
      const orderId = uuidv4();
      /**
       * initialise an array to contain the possible images from each of the customers
       * customisable options in their order.
       */
      const images: S3ImageProps[][] = [];
      /**
       * Iterate through all of the checked-out products (items where customisable
       * options/variants have been chosen) and extract any images so they can be
       * uploaded to S3.
       */
      products.forEach((product) => {
        /**
         * create an array which holds all the keys, region and bucket for each
         * individual image per product.
         */
        const imageKeys: S3ImageProps[] = [];
        // iterate through each products customisable options
        product.customOptions.forEach((option: unknown | unknown[]) => {
          /**
           * if the current value of the map is an array, and ALL of the items in that
           * array is of type object, then that is the array which is holding all of
           * the relevant images data.
           */
          if (
            Array.isArray(option) &&
            option.every((item: unknown) => typeof item === "object")
          ) {
            /**
             * iterate through all of the customOptions images array and extract all of
             * the relevant information to store them into an S3 bucket.
             */
            option.map(async (file) => {
              const filename = `${identityId}/${orderId}/${product.title}/${file.name}`;
              const uploadedFile = await Storage.put(filename, file, {
                contentType: file.type,
              });
              const { key } = uploadedFile as UploadedFile;
              const s3 = {
                key,
                bucket: awsExports.aws_user_files_s3_bucket,
                region: awsExports.aws_project_region,
              };
              // push the S3 object keys to imageKeys so they can be matched to the current product
              imageKeys.push(s3);
              option = filename;
            });
          }
        });
        /**
         * after iterating through all possible products & customOptions, push all of the imageKeys
         * from ALL products into one array of arrays - one sub-array for each individual product.
         */
        images.push(imageKeys);
      });

      /**
       * create an input object for creating a new order with the graphql createOrder
       * mutation. Other fields will be added to the database (such as stripePaymentIntent
       * and shippingAddress) by the server once the user completes payment (via stripeWebhook
       * lambda function)
       */
      const input = {
        id: orderId,
        products: products.map((product) => ({
          ...product,
          customOptions: JSON.stringify(product.customOptions),
        })),
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
          products: products.map((product) => ({
            ...product,
            // change each image to a url string which can be used to view their chosen product.
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
      <Typography variant="h4" className={classes.mainTitle}>
        Shopping Basket
      </Typography>
      <Typography className={classes.subtext}>
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
