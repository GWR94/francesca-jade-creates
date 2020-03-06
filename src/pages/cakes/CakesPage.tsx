import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { H3 } from "@blueprintjs/core";
import { Row, Col, Container } from "reactstrap";
import { listProducts } from "../../graphql/queries";
import Loading from "../../common/Loading";
import Product from "../../common/ProductCard";
import { ProductProps } from "../../common/interfaces/Product.i";

interface CakeState {
  isLoading: boolean;
  products: ProductProps[];
}

interface CakesProps {
  admin: boolean;
}

export default class CakesPage extends Component<CakesProps, CakeState> {
  public readonly state: CakeState = {
    isLoading: true,
    products: null,
  };

  public componentDidMount(): void {
    this.handleGetProducts();
  }

  private handleGetProducts = async (): Promise<void> => {
    try {
      const { data } = await API.graphql({
        query: listProducts,
        variables: {
          input: {
            filter: {
              type: {
                eq: "Cake",
              },
            },
          },
        },
        // @ts-ignore
        authMode: "API_KEY",
      });

      this.setState({
        products: data.listProducts.items,
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed handleGetProducts()");
    }
  };

  public render(): JSX.Element {
    const { isLoading, products } = this.state;
    const { admin } = this.props;
    return isLoading ? (
      <Loading size={100} />
    ) : (
      <Container style={{ marginTop: "20px" }}>
        <H3>Cakes</H3>
        <Row>
          {products.map(
            (product): JSX.Element => (
              <Col key={product.id} lg={3} md={4} sm={6}>
                <Product product={product} admin={admin} />
              </Col>
            ),
          )}
        </Row>
      </Container>
    );
  }
}
