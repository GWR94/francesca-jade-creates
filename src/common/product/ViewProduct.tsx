import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { Container } from "reactstrap";
import { H3, Tag, Button } from "@blueprintjs/core";
import ImageCarousel from "../ImageCarousel";
import { getProduct } from "../../graphql/queries";
import Loading from "../Loading";
import {
  UserAttributeProps,
  CognitoUserProps,
} from "../../pages/accounts/interfaces/Accounts.i";
import PayButton from "./PayButton";

interface Props {
  match: {
    params: {
      id: string;
    };
  };
  userAttributes: UserAttributeProps;
  user: CognitoUserProps;
}

const ViewProducts = ({ match, userAttributes }): JSX.Element => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const { id } = match.params;
    API.graphql({
      query: getProduct,
      variables: {
        id,
        limit: 100,
      },
      // @ts-ignore
      authMode: "API_KEY",
    })
      .then((prod) => setProduct(prod.data.getProduct))
      .catch((err) => console.error(err));
  }, []);

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
              The cost for {product.title.toLowerCase()} is £{product.price.toFixed(2)} +
              £{product.shippingCost.toFixed(2)} postage and packaging
            </p>
          ) : (
            <p>
              Please send a request with your personalisation preferences, and I will get
              back to you as soon as possible with a quote.
            </p>
          )}
        </div>
        <div className="view__button-container">
          {product.price > 0 ? (
            <PayButton product={product} userAttributes={userAttributes} />
          ) : (
            <Button intent="success">
              <i className="fas fa-credit-card view__icon" />
              Request a Quote
            </Button>
          )}
        </div>
      </div>
    </Container>
  ) : (
    <Loading />
  );
};

export default ViewProducts;
