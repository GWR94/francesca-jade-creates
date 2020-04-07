import React from "react";
import { API } from "aws-amplify";
import { Container } from "reactstrap";
import { H3, Tag, Button } from "@blueprintjs/core";
import { connect } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ImageCarousel from "../ImageCarousel";
import { getProduct } from "../../graphql/queries";
import Loading from "../Loading";
import {
  UserAttributeProps,
  CognitoUserProps,
} from "../../pages/accounts/interfaces/Accounts.i";
import PayButton from "./PayButton";
import * as actions from "../../actions/basket.actions";
import { AddItemAction } from "../../interfaces/basket.redux.i";
import { ProductProps } from "../interfaces/Product.i";

interface ViewProps {
  id: string;
  userAttributes: UserAttributeProps;
  user: CognitoUserProps;
  addToBasket?: (product) => AddItemAction;
}

interface ViewState {
  product: ProductProps;
}

interface ViewDispatchProps {
  addToBasket: (product) => AddItemAction;
}

export class ViewProduct extends React.Component<ViewProps, ViewState> {
  public readonly state = {
    product: null,
  };

  public componentDidMount(): void {
    this.getProducts();
  }

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
      throw new Error("Unable to fetch product");
    }
  };

  // const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);

  public render(): JSX.Element {
    const { product } = this.state;
    const { userAttributes, addToBasket } = this.props;
    return product ? (
      <Container className="content-container">
        <div className="view__container">
          <H3 className="view__title">{product.title}</H3>
          <p className="view__description">{product.description}</p>
          <div className="view__tags">
            {product.tags.map(
              (tag, i): JSX.Element => (
                <Tag active key={i} style={{ margin: "0px 4px 4px" }}>
                  {tag}
                </Tag>
              ),
            )}
          </div>
          <ImageCarousel images={product.image} />
          <div className="view__price">
            {product.price > 0 ? (
              <p>
                The cost for {product.title.toLowerCase()} is £{product.price.toFixed(2)}{" "}
                + £{product.shippingCost.toFixed(2)} postage and packaging
              </p>
            ) : (
              <p>
                Please send a request with your personalisation preferences, and I will
                get back to you as soon as possible with a quote.
              </p>
            )}
          </div>
          {product.price > 0 ? (
            userAttributes && (
              <Button
                intent="primary"
                onClick={(): AddItemAction => {
                  const {
                    id,
                    title,
                    price,
                    shippingCost,
                    description,
                    image,
                    type,
                  } = product;
                  return addToBasket({
                    id,
                    title,
                    description,
                    price,
                    shippingCost,
                    image,
                    type,
                  });
                }}
                text="Add to Basket"
                icon={<i className="fas fa-shopping-cart" />}
              />
            )
          ) : (
            <Button intent="success">
              <i className="fas fa-credit-card view__icon" />
              Request a Quote
            </Button>
          )}
        </div>
      </Container>
    ) : (
      <Loading />
    );
  }
}

const mapDispatchToProps = (dispatch): ViewDispatchProps => ({
  addToBasket: (product): AddItemAction => dispatch(actions.addToBasket(product)),
});

export default connect(null, mapDispatchToProps)(ViewProduct);
