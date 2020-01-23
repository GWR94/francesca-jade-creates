import React, { Component } from "react";
import { H3 } from "@blueprintjs/core";
import { Col, Row } from "reactstrap";
import { API, graphqlOperation } from "aws-amplify";
import { listProducts } from "../graphql/queries";
import Loading from "./Loading";
import Product from "./Product";

interface Props {
  products: any;
}
interface State {}

class ProductsList extends Component<Props, State> {
  private onDeleteProduct = async (): Promise<void> => {
    // do something
  };

  public render(): JSX.Element {
    const { products } = this.props;
    console.log(products);
    return (
      <div>
        <H3>Products</H3>
        <Row>
          {products ? (
            products.map(
              (product): JSX.Element => (
                <Col md={4} sm={6} key={product.id}>
                  <Product {...product} />
                </Col>
              ),
            )
          ) : (
            <Loading size={100} />
          )}
        </Row>
      </div>
    );
  }
}

export default ProductsList;
