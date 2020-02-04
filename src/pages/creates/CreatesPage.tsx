import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { H3 } from "@blueprintjs/core";
import { Row, Col, Container } from "reactstrap";
import { listProducts } from "../../graphql/queries";
import Loading from "../../components/Loading";
import Product from "../../components/Product";
import { ProductProps } from "../accounts/interfaces/Product.i";

interface State {
  isLoading: boolean;
  products: ProductProps[];
}

export default class CreatesPage extends Component<{}, State> {
  public readonly state: State = {
    isLoading: true,
    products: null,
  };

  public componentDidMount(): void {
    this.handleGetProducts();
  }

  private handleGetProducts = async (): Promise<void> => {
    const { data } = await API.graphql(
      graphqlOperation(listProducts, {
        filter: {
          type: {
            ne: "Cake",
          },
        },
      }),
    );
    this.setState({ products: data.listProducts.items, isLoading: false });
  };

  public render(): JSX.Element {
    const { isLoading, products } = this.state;
    console.log(products);
    return isLoading ? (
      <Loading size={100} />
    ) : (
      <Container style={{ marginTop: "20px" }}>
        <H3>Creations</H3>
        <Row>
          {products.map(
            (product): JSX.Element => (
              <Col key={product.id} lg={3} md={4} sm={6}>
                <Product {...product} customer />
              </Col>
            ),
          )}
        </Row>
      </Container>
    );
  }
}
