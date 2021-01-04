import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import {
  Container,
  Button,
  ThemeProvider,
  Chip,
  makeStyles,
  Typography,
  Grid,
  Divider,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/scss/image-gallery.scss";
import { getProduct } from "../../../graphql/queries";
import Loading from "../../../common/Loading";
import * as basketActions from "../../../actions/basket.actions";
import { ViewProps } from "../interfaces/ViewProduct.i";
import { chipTheme } from "../../../common/styles/viewProduct.style";
import { AppState } from "../../../store/store";
import { ProductProps, S3ImageProps } from "../interfaces/Product.i";
import styles from "../styles/viewProduct.style";
import ViewVariants from "./ViewVariants";
import { getCompressedKey, getSignedS3Url } from "../../../utils";
import QuoteDialog from "./QuoteDialog";
import { openSnackbar } from "../../../utils/Notifier";

interface ViewProductState {
  // create boolean state value for loading to show/hide UI loading effects
  isLoading: boolean;
  // store the product in state so it can be accessed throughout component
  product: ProductProps | null;
  images: { [key: string]: string }[];
  quoteDialogOpen: boolean;
}

/**
 * Functional component to view the selected products data, including their variants,
 * customisable features, images, description etc.
 * @param id - The id of the product that is currently being viewed by the user
 * @param type - The type of product that the user is trying to view ("Cake" or
 * "Creates").
 */
const ViewProduct: React.FC<ViewProps> = ({
  id,
  type: productType,
}): JSX.Element | null => {
  // create state for a loading boolean which will show/hide loading UI effects.
  const [state, setState] = useState<ViewProductState>({
    isLoading: true,
    product: null,
    images: [],
    quoteDialogOpen: false,
  });

  // get the users' id (sub) to check the current authenticated user
  const sub = useSelector(({ user }: AppState) => user.id);
  // retrieve the products so they can be mutated/checked within the component.
  const products = useSelector(({ basket }: AppState) => basket.items);
  // execute makeStyles based on external styles and store function in variable.
  const useStyles = makeStyles(styles);
  // execute the useStyles function and store result in variable.
  const classes = useStyles();

  /**
   * Function to get the data of the chosen product and store it into state.
   * The function will be executed as the component mounts, so all of the relevant
   * data will be available in state before the first render.
   */
  const getCurrentProduct = async (): Promise<void> => {
    /**
     * Execute the getProduct graphQL query to retrieve the products data, and
     * destructure the data property from the result.
     */
    const { data } = await API.graphql({
      query: getProduct,
      variables: {
        id,
        limit: 100,
      },
      // @ts-ignore
      authMode: "API_KEY", // FIXME
    });
    // create an array to store the images in
    const images: { [key: string]: string }[] = [];
    /**
     * Iterate through the images collection from the getProduct query, and
     * push to results images array, modifying them where necessary.
     */
    data.getProduct.images.collection.map(async (image: S3ImageProps) => {
      // get the compressed image key by using the util function
      const compressedKey = getCompressedKey(image.key);
      // retrieve the full resolution signed image url
      const originalURL = await getSignedS3Url(image.key);
      // get the compressed thumbnail singed image url
      const thumbnailURL = await getSignedS3Url(compressedKey);
      // push the urls into the images array
      images.push({
        original: originalURL,
        thumbnail: thumbnailURL,
        thumbnailClass: "thumbnail",
      });
    });
    // update the state with all values
    setState({
      ...state,
      images,
      isLoading: false,
      product: data.getProduct,
    });
  };

  /**
   * When the component mounts, run the getCurrentProduct function so all
   * relevant data is stored before the component is rendered.
   */
  let isMounted = false;
  useEffect(() => {
    isMounted = true;
    if (isMounted) getCurrentProduct();
    return (): void => {
      isMounted = false;
    };
  }, []);

  // store the useDispatch hook into a variable so it can be used throughout
  const dispatch = useDispatch();
  // store the useHistory hook into a variable so it can be used throughout
  const history = useHistory();

  /**
   * Function to add the current product into the basket redux store, so it can
   * be purchased from anywhere around the site.
   */
  const handleAddToBasket = (): void | null => {
    // destructure product from state
    const { product } = state;
    // check to see the product exists, if it doesn't, return null
    console.log(product);
    if (!product) return null;

    // destructure relevant properties from product
    const {
      id,
      title,
      description,
      images,
      type,
      tagline,
      variants,
      customOptions,
    } = product;
    /**
     * Dispatch the addToBasket action, which will add the product passed
     * as the parameter into the basket redux store.
     */
    if (products.findIndex((p) => p.title === title) === -1) {
      dispatch(
        basketActions.addToBasket({
          id,
          title,
          description,
          image: images.collection[images.cover],
          variants,
          type,
          tagline,
          customOptions,
        }),
      );
      return openSnackbar({
        message: `Added ${product.title} to basket.`,
        severity: "success",
      });
    } else {
      return openSnackbar({
        message: `${product.title} is already in the basket.`,
        severity: "error",
      });
    }
  };

  const { product, isLoading, images, quoteDialogOpen } = state;
  console.log(state.images);
  // if there is no product, return null as nothing can be rendered
  if (!product) return null;
  // destructure all relevant data from product
  const {
    tagline,
    title,
    description,
    tags,
    setPrice,
    variants,
    customOptions,
    type,
  } = product;
  return isLoading ? (
    <Loading />
  ) : (
    <Container className={classes.container}>
      {/* Render a large title and a smaller tagline to briefly describe the product */}
      <div>
        <Typography variant="h4" className={classes.title}>
          {title}
        </Typography>
        {tagline && (
          <Typography variant="h6" className={classes.tagline}>
            {tagline}
          </Typography>
        )}
        {/* Map all of the tags into a chip to show to the user */}
        <ThemeProvider theme={chipTheme}>
          <div className={classes.tagsContainer}>
            {tags.map(
              (tag: string, i: number): JSX.Element => (
                <Chip
                  key={i}
                  size="small"
                  className={classes.chip}
                  // change the color based on the productType
                  color={productType === "Creates" ? "primary" : "secondary"}
                  label={tag}
                />
              ),
            )}
          </div>
        </ThemeProvider>
      </div>
      {/* Set the jsx from description to innerHTML of the description div */}
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: description }}
        style={{ marginBottom: 10 }}
      />
      <Divider style={{ marginBottom: 16 }} variant="middle" />
      <Grid container spacing={2} alignItems="center" justify="center">
        <Grid item xs={12} sm={7} style={{ marginBottom: 30 }}>
          {/* Render the images from the product */}
          <ImageGallery
            items={images}
            thumbnailPosition="left"
            showNav={images.length > 1}
            showPlayButton={images.length > 1}
          />
          {/* 
            If the product type is a cake, then the user must request a quote,
            as there are no set prices for cakes.
          */}
          {type === "Cake" && (
            <div className={classes.buttonContainer}>
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                // open the QuoteDialog component on click
                onClick={(): void => setState({ ...state, quoteDialogOpen: true })}
                startIcon={<i className={`fas fa-credit-card ${classes.viewIcon}`} />}
              >
                Request a Quote
              </Button>
            </div>
          )}
        </Grid>
        {type === "Creates" && (
          <Grid item xs={12} sm={5} style={{ marginBottom: 30 }}>
            {/* Describe the product and show variants in ViewVariants component */}
            <ViewVariants variants={variants} customOptions={customOptions} type={type} />
            <div className={classes.buttonContainer}>
              {sub ? (
                /**
                 * If there is a users' sub (user is logged in) and setPrice is true, then
                 * a button to add the current item to the basket should be rendered
                 */
                setPrice && (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleAddToBasket}
                    startIcon={
                      <i className={`fas fa-shopping-cart ${classes.viewIcon}`} />
                    }
                  >
                    Add to Basket
                  </Button>
                )
              ) : (
                // If there is no sub, then the user isn't logged in, so they must first do that.
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  // redirect to login page on click
                  onClick={(): void => history.push("/login")}
                  startIcon={<i className={`fas fa-user ${classes.viewIcon}`} />}
                >
                  Login to Purchase
                </Button>
              )}
            </div>
          </Grid>
        )}
      </Grid>
      {/* Render the dialog to allow the user to request a quote */}
      <QuoteDialog
        open={quoteDialogOpen}
        onClose={(): void => setState({ ...state, quoteDialogOpen: false })}
        cake={product.title}
      />
    </Container>
  );
};

export default ViewProduct;
