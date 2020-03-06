import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { H3 } from "@blueprintjs/core";
import { History } from "history";
import { Row, Col, Container } from "reactstrap";
import { listProducts } from "../../graphql/queries";
import Loading from "../../common/Loading";
import Product from "../../common/ProductCard";
import { ProductProps } from "../../common/interfaces/Product.i";
import SearchFilter from "../../common/SearchFilter";

interface CreatesState {
  isLoading: boolean;
  products: ProductProps[];
}

interface CreatesProps {
  admin: boolean;
  history: History;
}

export default class CreatesPage extends Component<CreatesProps, CreatesState> {
  public readonly state: CreatesState = {
    isLoading: true,
    products: null,
  };

  public componentDidMount(): void {
    this.handleGetProducts();
  }

  private handleGetProducts = async (): Promise<void> => {
    const { data } = await API.graphql({
      query: listProducts,
      variables: {
        input: {
          filter: {
            type: {
              ne: "Cake",
            },
          },
        },
      },
      // @ts-ignore
      authMode: "API_KEY",
    });
    this.setState({ products: data.listProducts.items, isLoading: false });
  };

  public render(): JSX.Element {
    const { isLoading, products } = this.state;
    const { admin, history } = this.props;
    return isLoading ? (
      <Loading size={100} />
    ) : (
      <Container style={{ marginTop: "20px" }}>
        <H3>Creations</H3>
        <SearchFilter />
        <Row>
          {products.map(
            (product): JSX.Element => (
              <Col key={product.id} lg={3} md={4} sm={6}>
                <Product product={product} admin={admin} history={history} />
              </Col>
            ),
          )}
        </Row>
      </Container>
    );
  }
}
