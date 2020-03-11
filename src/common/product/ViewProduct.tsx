import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { Container } from "reactstrap";
import { H3, Tag, Button } from "@blueprintjs/core";
import ImageCarousel from "../ImageCarousel";
import { getProduct } from "../../graphql/queries";
import Loading from "../Loading";

interface Props {
  match: {
    params: {
      id: string;
    };
  };
}

const ViewProducts = ({ match }): JSX.Element => {
  const [product, setProduct] = useState(null);
  useEffect(() => {
    const { id } = match.params;
    API.graphql(graphqlOperation(getProduct, { id }))
      .then((prod) => setProduct(prod.data.getProduct))
      .catch((err) => console.error(err));
  }, []);

  console.log(product);
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
              Please send a request with your personalisation prefernces, and I will get
              back to you as soon as possible wity a quote.
            </p>
          )}
        </div>
        <div className="view__button-container">
          {product.price > 0 ? (
            <Button intent="success" onClick={(): void => console.log("Pay")}>
              <i className="fas fa-credit-card view__icon" />
              Pay with Stripe
            </Button>
          ) : (
            <Button intent="success" onClick={(): void => console.log("quote")}>
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
