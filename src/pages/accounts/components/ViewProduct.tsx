import React from "react";
import { API } from "aws-amplify";
import { Container, Button, ThemeProvider, Chip } from "@material-ui/core";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import ImageCarousel from "../../../common/containers/ImageCarousel";
import { getProduct } from "../../../graphql/queries";
import Loading from "../../../common/Loading";
import * as actions from "../../../actions/basket.actions";
import { AddItemAction } from "../../../interfaces/basket.redux.i";
import { ViewProps, ViewState, ViewDispatchProps } from "../interfaces/ViewProduct.i";
import { chipTheme, buttonTheme } from "../../../common/styles/viewProduct.style";

export class ViewProduct extends React.Component<ViewProps, ViewState> {
  public readonly state: ViewState = {
    product: null,
  };

  public componentDidMount(): void {
    this.getProducts();
  }

  public handleAddToBasket = (): AddItemAction | null => {
    const { product } = this.state;
    const { addToBasket } = this.props;
    if (!product) return null;
    const { id, title, price, shippingCost, description, image, type, tagline } = product;
    return addToBasket({
      id,
      title,
      description,
      price,
      shippingCost,
      image: image[0],
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
        product: data.getProduct,
      });
    } catch (err) {
      console.error(err);
    }
  };

  public render(): JSX.Element {
    const { product } = this.state;
    const { userAttributes } = this.props;
    return product ? (
      <Container className="content-container">
        <div className="view__container">
          <h3 className="view__title">{product.title}</h3>
          <p className="view__description">{product.description}</p>
          <ThemeProvider theme={chipTheme}>
            <div className="view__tags">
              {product.tags.map(
                (tag, i): JSX.Element => (
                  <Chip
                    key={i}
                    size="small"
                    color={product.type === "Cake" ? "primary" : "secondary"}
                    style={{ margin: "0px 4px 4px", color: "#fff" }}
                    label={tag}
                  />
                ),
              )}
            </div>
          </ThemeProvider>
          <ImageCarousel images={product.image} type={product.type} />
          <div className="view__price">
            {product.price > 0 ? (
              <p>
                The cost for {product.title} is £{product.price.toFixed(2)} + £
                {product.shippingCost.toFixed(2)} postage and packaging
              </p>
            ) : (
              <p>
                Please send a request with your personalisation preferences, and I will
                get back to you as soon as possible with a quote.
              </p>
            )}
          </div>
          <ThemeProvider theme={buttonTheme}>
            {product.price > 0 ? (
              userAttributes && (
                <Button
                  variant="contained"
                  color="primary"
                  style={{ color: "#fff" }}
                  onClick={this.handleAddToBasket}
                  startIcon={<i className="fas fa-shopping-cart view__icon" />}
                >
                  Add to Basket
                </Button>
              )
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
            )}
          </ThemeProvider>
        </div>
      </Container>
    ) : (
      <Loading />
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AddItemAction>): ViewDispatchProps => ({
  addToBasket: (product): AddItemAction => dispatch(actions.addToBasket(product)),
});

export default connect(null, mapDispatchToProps)(ViewProduct);
