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
import { v4 as uuidv4 } from "uuid";
import ImageCarousel from "../../../common/containers/ImageCarousel";
import { getProduct } from "../../../graphql/queries";
import Loading from "../../../common/Loading";
import * as basketActions from "../../../actions/basket.actions";
import { AddItemAction } from "../../../interfaces/basket.redux.i";
import { ViewProps } from "../interfaces/ViewProduct.i";
import { chipTheme, buttonTheme } from "../../../common/styles/viewProduct.style";
import { AppState } from "../../../store/store";
import { ProductProps } from "../interfaces/Product.i";
import styles from "../styles/viewProduct.style";

const ViewProduct: React.FC<ViewProps> = ({ id, type: productType }): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<ProductProps>();
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
    setLoading(false);
  };

  useEffect(() => {
    getCurrentProduct();
  }, []);

  const handleViewVariants = (): JSX.Element[] => {
    const { variants } = product as ProductProps;
    const data: JSX.Element[] = [];
    if (!product) return data;
    let i = 1;
    for (const variant of variants) {
      const { variantName, dimensions, features, price } = variant;
      data.push(
        <div key={uuidv4()} className={classes.variant}>
          <Typography className={classes.variantTitle}>
            {variantName || `Variant ${i}`}
          </Typography>
          <Typography>
            Dimensions: <span className={classes.info}>{dimensions}</span>
          </Typography>
          <Typography>
            Cost:{" "}
            <span className={classes.info}>
              £{price.item.toFixed(2)} + £{price.postage.toFixed(2)} P&P
            </span>
          </Typography>
        </div>,
      );
    }
    i++;
    data.push(<div className={classes.break} />);
    data.push(
      <div className={classes.customFeatures}>
        <Typography gutterBottom className={classes.variantTitle}>
          Customisable Features
        </Typography>
        <ul style={{ margin: 0 }}>
          {product.variants[0].features.map((feature) => {
            return <li key={uuidv4()}>{feature.name}</li>;
          })}
        </ul>
      </div>,
    );
    return data;
  };

  const dispatch = useDispatch();

  const handleAddToBasket = (): AddItemAction | null => {
    if (!product) return null;
    const { id, title, description, images, type, tagline, variants } = product;
    return dispatch(
      basketActions.addToBasket({
        id,
        title,
        description,
        image: images.collection[images.cover],
        variants,
        type,
        tagline,
      }),
    );
  };

  const handleQuoteQuery = (): void => {
    // TODO
    console.log("todo");
  };

  // public getPriceValues = (): string => {
  //   const {
  //     product: { variants },
  //   } = this.state;
  //   let min = Infinity;
  //   let max = -Infinity;
  //   if (variants?.length) {
  //     for (const variant of variants) {
  //       min = Math.min(variant.price.item, min);
  //       max = Math.max(variant.price.item, max);
  //     }
  //   }
  //   if (min === max) return `£${min}`;
  //   else if(min === Infinity || max === -Infinity) return `Variable Price - `
  // };

  const history = useHistory();
  return isLoading || product === undefined ? (
    <Loading />
  ) : (
    <Container>
      <div className={classes.container}>
        <Typography variant="h4">{product.title}</Typography>
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
          <Grid item xs={12} sm={5}>
            <ImageCarousel images={product.images.collection} type={productType} />
          </Grid>
          <Grid item xs={12} sm={7}>
            <Typography variant="h5" style={{ marginBottom: -5 }}>
              Variants
            </Typography>
            <div className={classes.variantContainer}>{handleViewVariants()}</div>
          </Grid>
        </Grid>
        {/* <div className="view__price">
          {product.setPrice ? (
            <p>
              The cost for {product.title} is £{product.price.item.toFixed(2)} + £
              {price.postage.toFixed(2)} postage and packaging
            </p>
          ) : (
            <p>
              Please send a request with your personalisation preferences, and I will get
              back to you as soon as possible with a quote.
            </p>
          )}
        </div> */}
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
      </div>
    </Container>
  );
};

export default ViewProduct;
