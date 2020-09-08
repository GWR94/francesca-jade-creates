import React from "react";
import { API } from "aws-amplify";
import { Container, Button, ThemeProvider, Chip } from "@material-ui/core";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import ImageCarousel from "../../../common/containers/ImageCarousel";
import { getProduct } from "../../../graphql/queries";
import Loading from "../../../common/Loading";
import * as basketActions from "../../../actions/basket.actions";
import * as productsActions from "../../../actions/products.actions";
import { AddItemAction } from "../../../interfaces/basket.redux.i";
import { ViewProps, ViewState, ViewDispatchProps } from "../interfaces/ViewProduct.i";
import { chipTheme, buttonTheme } from "../../../common/styles/viewProduct.style";
import { AppState } from "../../../store/store";
import { useHistory } from "react-router-dom";

export class ViewProduct extends React.Component<ViewProps, ViewState> {
  public readonly state: ViewState = {
    product: {
      id: "",
      title: "",
      description: "",
      tagline: "",
      type: "Cake",
      images: {
        cover: 0,
        collection: [],
      },
      tags: [],
      setPrice: false,
      variants: [],
      customOptions: [],
    },
  };

  public componentDidMount(): void {
    const { id, getCurrentProduct } = this.props;

    this.getProducts();
  }

  public handleAddToBasket = (): AddItemAction | null => {
    const { product } = this.state;
    const { addToBasket } = this.props;
    if (!product) return null;
    const { id, title, description, images, type, tagline, variants } = product;
    return addToBasket({
      id,
      title,
      description,
      image: images.collection[images.cover],
      variants,
      type,
      tagline,
    });
  };

  public handleQuoteQuery = (): void => {
    // TODO
    console.log("todo");
  };

  public getProducts = async (): Promise<void> => {
    const { id } = this.props;
    try {
      const { data } = await API.graphql({
        query: getProduct,
        variables: {
          id,
          limit: 100,
        },
        // @ts-ignore
        authMode: "API_KEY",
      });
      this.setState({
        product: {
          ...data.getProduct,
        },
      });
    } catch (err) {
      console.error(err);
    }
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

  public render(): JSX.Element {
    const { product } = this.state;
    const { tags, type, images, description, title, variants, setPrice } = product;
    const { sub } = this.props;
    const history = useHistory();
    return product ? (
      <Container className="content-container">
        <div className="view__container">
          <h3 className="view__title">{title}</h3>
          <p className="view__description">{description}</p>
          <ThemeProvider theme={chipTheme}>
            <div className="view__tags">
              {tags.map(
                (tag: string, i: number): JSX.Element => (
                  <Chip
                    key={i}
                    size="small"
                    color={type === "Cake" ? "primary" : "secondary"}
                    style={{ margin: "0px 4px 4px", color: "#fff" }}
                    label={tag}
                  />
                ),
              )}
            </div>
          </ThemeProvider>
          <ImageCarousel images={images.collection} type={type} />
          {/* <div className="view__price">
            {setPrice ? (
              <p>
                The cost for {title} is £{price.item.toFixed(2)} + £
                {price.postage.toFixed(2)} postage and packaging
              </p>
            ) : (
              <p>
                Please send a request with your personalisation preferences, and I will
                get back to you as soon as possible with a quote.
              </p>
            )}
          </div> */}
          <ThemeProvider theme={buttonTheme}>
            {sub ? (
              setPrice ? (
                <Button
                  variant="contained"
                  color="primary"
                  style={{ color: "#fff" }}
                  onClick={this.handleAddToBasket}
                  startIcon={<i className="fas fa-shopping-cart view__icon" />}
                >
                  Add to Basket
                </Button>
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  style={{ color: "#fff" }}
                  onClick={this.handleQuoteQuery}
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
    ) : (
      <Loading />
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch): ViewDispatchProps => ({
  addToBasket: (product): AddItemAction => dispatch(basketActions.addToBasket(product)),
});

const mapStateToProps = ({ user }: AppState): { sub: string | null } => ({
  sub: user.id,
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewProduct);
