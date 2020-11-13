// give unauth and auth roles pemission to view products folder

import React, { useEffect, useState } from "react";
import { API, Auth } from "aws-amplify";
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
import AWS from "aws-sdk";
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
import { getCompressedKey } from "../../../utils";

const ViewProduct: React.FC<ViewProps> = ({ id, type: productType }): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<ProductProps>();
  const [images, setImages] = useState<{ [key: string]: string }[]>([]);
  const sub = useSelector(({ user }: AppState) => user.id);
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const s3 = new AWS.S3({
    endpoint: "s3-eu-west-2.amazonaws.com",
    signatureVersion: "v4",
    region: "eu-west-2",
    accessKeyId: process.env.ACCESS_KEY_AWS,
    secretAccessKey: process.env.SECRET_KEY_AWS,
  });

  const getSignedS3Url = async (key: string, level = "public"): Promise<string> => {
    const url = s3.getSignedUrl("getObject", {
      Bucket: process.env.IMAGE_S3_BUCKET,
      Key: `${level}/${key}`,
    });
    return url;
  };

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
    data.getProduct.images.collection.map(async (image: S3ImageProps) => {
      const compressedKey = getCompressedKey(image.key);
      images.push({
        original: await getSignedS3Url(image.key),
        thumbnail: await getSignedS3Url(compressedKey),
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
