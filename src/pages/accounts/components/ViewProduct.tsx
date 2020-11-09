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
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/scss/image-gallery.scss";
import { v4 as uuidv4 } from "uuid";
import ImageCarousel from "../../../common/containers/ImageCarousel";
import { getProduct } from "../../../graphql/queries";
import Loading from "../../../common/Loading";
import * as basketActions from "../../../actions/basket.actions";
import { AddItemAction } from "../../../interfaces/basket.redux.i";
import { ViewProps } from "../interfaces/ViewProduct.i";
import { chipTheme, buttonTheme } from "../../../common/styles/viewProduct.style";
import { AppState } from "../../../store/store";
import { ProductProps, S3ImageProps } from "../interfaces/Product.i";
import styles from "../styles/viewProduct.style";
import { Variant } from "../interfaces/Variants.i";
import ViewVariants from "./ViewVariants";

const ViewProduct: React.FC<ViewProps> = ({ id, type: productType }): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<ProductProps>();
  const [images, setImages] = useState<{ [key: string]: string }[]>([]);
  const sub = useSelector(({ user }: AppState) => user.id);
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const getCurrentProduct = async (): Promise<void> => {
    const { data } = await API.graphql({
      query: getProduct,
      variables: {
        id,
        limit: 100,
      },
      // @ts-ignore
      authMode: "API_KEY",
    });
    setProduct(data.getProduct);
    const images: { [key: string]: string }[] = [];
    data.getProduct.images.collection.map((image: S3ImageProps) => {
      images.push({
        original: `https://${process.env.IMAGE_S3_BUCKET}.s3.${process.env.BUCKET_REGION}.amazonaws.com/public/${image.key}`,
        thumbnail: `https://${process.env.IMAGE_S3_BUCKET}.s3.${process.env.BUCKET_REGION}.amazonaws.com/public/${image.key}`,
        thumbnailClass: "thumbnail",
      });
    });
    setImages(images);
    setLoading(false);
  };

  useEffect(() => {
    getCurrentProduct();
  }, []);

  const dispatch = useDispatch();

  const handleAddToBasket = (): AddItemAction | null => {
    if (!product) return null;
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

    return dispatch(
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
  };

  const handleQuoteQuery = (): void => {
    // TODO
    console.log("todo");
  };

  const history = useHistory();
  if (!product) return null;
  return isLoading ? (
    <Loading />
  ) : (
    <Container className={classes.container}>
      <Typography variant="h4">{product.title}</Typography>
      {product.tagline && (
        <Typography variant="h6" className={classes.tagline}>
          {product.tagline}
        </Typography>
      )}
      <ThemeProvider theme={chipTheme}>
        <div className="view__tags">
          {product.tags.map(
            (tag: string, i: number): JSX.Element => (
              <Chip
                key={i}
                size="small"
                color={productType === "Cake" ? "primary" : "secondary"}
                style={{ margin: "0px 4px 4px", color: "#fff" }}
                label={tag}
              />
            ),
          )}
        </div>
      </ThemeProvider>
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: product.description }}
        style={{ marginBottom: 10 }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {/* <ImageCarousel
              images={product.images.collection}
              cover={product.images.cover}
              type={productType}
              isCentered
            /> */}
          <ImageGallery items={images} thumbnailPosition="left" />
        </Grid>
        <Grid item xs={12} md={6}>
          <ViewVariants variants={product.variants} />
        </Grid>
      </Grid>
      <ThemeProvider theme={buttonTheme}>
        {sub ? (
          product.setPrice ? (
            <Button
              variant="contained"
              color="primary"
              style={{ color: "#fff" }}
              onClick={handleAddToBasket}
              startIcon={<i className="fas fa-shopping-cart view__icon" />}
            >
              Add to Basket
            </Button>
          ) : (
            <Button
              color="primary"
              variant="contained"
              style={{ color: "#fff" }}
              onClick={handleQuoteQuery}
              startIcon={<i className="fas fa-credit-card view__icon" />}
            >
              Request a Quote
            </Button>
          )
        ) : (
          <Button
            variant="contained"
            color="primary"
            style={{ color: "#fff" }}
            onClick={(): void => history.push("/login")}
            startIcon={<i className="fas fa-user view__icon" />}
          >
            Login to Purchase
          </Button>
        )}
      </ThemeProvider>
    </Container>
  );
};

export default ViewProduct;
