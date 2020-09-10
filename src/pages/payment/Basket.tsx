import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API, Auth, graphqlOperation, Storage } from "aws-amplify";
import { loadStripe } from "@stripe/stripe-js";
import { v4 as uuidv4 } from "uuid";
import { InfoOutlined, FavoriteBorder } from "@material-ui/icons";
import {
  Typography,
  Button,
  makeStyles,
  Grid,
  Hidden,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
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
import awsExports from "../../aws-exports";
import { S3ImageProps } from "../accounts/interfaces/Product.i";
import { UserState } from "../../reducers/user.reducer";

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
  const [isLoading, setLoading] = useState(true);
  const [savedProducts, setSavedProducts] = useState<BasketItemProps[]>([]);
  const [isSubmitted, setSubmitted] = useState<boolean>(false);
  const history = useHistory();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("xs"));

  const getSavedProducts = async (): Promise<void> => {
    try {
      const { data } = await API.graphql(graphqlOperation(getUser, { id }));
      setSavedProducts(data.getUser?.savedProducts ?? []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  let isMounted = false;
  const dispatch = useDispatch();

  const getMinPrice = (product: BasketItemProps): string => {
    let min = Infinity;
    product.variants.forEach((variant) => {
      min = Math.min(variant.price.item, min);
    });
    return min === Infinity ? "Request for Price" : `From £${min.toFixed(2)}`;
  };

  let user;

  const handleGetUser = async (): Promise<void> => {
    const { data } = await API.graphql(graphqlOperation(getUser, { id }));
    console.log(data.getUser);
    user = data.getUser;
  };

  useEffect(() => {
    // isMounted is for suppressing React error for updating state on unmounted component
    isMounted = true;
    if (isMounted) {
      getSavedProducts();
      dispatch(actions.clearCheckout());
      handleGetUser();
    }

    return (): void => {
      isMounted = false;
    };
  }, []);

  const convertS3ObjectToUrl = (s3: S3ImageProps): string => {
    const { key, bucket, region } = s3;
    return `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`;
  };

  console.log(products);

  const handleCreateCheckout = async (): Promise<void> => {
    try {
      setSubmitted(true);
      const stripe = await stripePromise;

      const { identityId } = await Auth.currentCredentials();
      const orderId = uuidv4();

      const images: S3ImageProps[][] = [];

      products.forEach((product) => {
        const imageKeys: S3ImageProps[] = [];
        product.customOptions.forEach((option: unknown | unknown[]) => {
          if (
            Array.isArray(option) &&
            option.every((item: unknown) => typeof item === "object")
          ) {
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
              imageKeys.push(s3);
              option = filename;
            });
          }
        });
        images.push(imageKeys);
      });
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
      await API.graphql(graphqlOperation(createOrder, { input }));
      const response = await API.post("orderlambda", "/orders/create-checkout-session", {
        body: {
          products: products.map((product) => ({
            ...product,
            image: convertS3ObjectToUrl(product.image),
          })),
          email,
          orderId,
        },
      });
      console.log(response);
      const result = await stripe?.redirectToCheckout({
        sessionId: response.id,
      });
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
      <Typography variant="h5">Shopping Basket</Typography>
      <Grid container spacing={2}>
        <Grid item sm={12} md={8}>
          {items.length > 0 ? (
            <div>
              {items.map((item) => {
                const uid = uuidv4();
                return (
                  <BasketItem
                    item={item}
                    key={uid}
                    sub={id}
                    savedProducts={savedProducts}
                    updateSavedProducts={(products): void => setSavedProducts(products)}
                  />
                );
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
          <h3 className="basket__title">Saved For Later</h3>
          {savedProducts?.length > 0 ? (
            <>
              {savedProducts.map((item) => {
                const uid = uuidv4();
                return (
                  <BasketItem
                    item={item}
                    key={uid}
                    sub={id}
                    saved
                    savedProducts={savedProducts}
                    updateSavedProducts={(products): void => setSavedProducts(products)}
                  />
                );
              })}
            </>
          ) : (
            <NonIdealState
              Icon={<FavoriteBorder />}
              title="No Saved Items"
              subtext='To save a product for next time you visit, click the "Save for Later" text'
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
                    <span className={classes.cost}>£{cost.toFixed(2)}</span>
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
