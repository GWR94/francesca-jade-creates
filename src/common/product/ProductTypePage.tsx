import React, { Component } from "react";
import { API } from "aws-amplify";
import { History } from "history";
import { Container } from "reactstrap";
import { listProducts } from "../../graphql/queries";
import Loading from "../Loading";
import { ProductProps } from "../interfaces/Product.i";
import ProductsList from "../../pages/accounts/components/ProductsList";
import { H3 } from "@blueprintjs/core";

interface ProductTypeState {
  isLoading: boolean;
  products: ProductProps[];
  queryResults: ProductProps[];
}

interface ProductTypeProps {
  admin?: boolean;
  history: History;
  type: "Cake" | "Creates";
}

export default class ProductTypePage extends Component<
  ProductTypeProps,
  ProductTypeState
> {
  public readonly state: ProductTypeState = {
    isLoading: true,
    products: null,
    queryResults: null,
  };

  public componentDidMount(): void {
    this.handleGetProducts();
  }

  private handleGetProducts = async (): Promise<void> => {
    const { type } = this.props;
    const filtering = type && {
      type: {
        eq: type,
      },
    };

    const { data } = await API.graphql({
      query: listProducts,
      variables: {
        filter: filtering,
        limit: 100,
      },
      // @ts-ignore
      authMode: "API_KEY",
    });
    this.setState({ products: data.listProducts.items, isLoading: false });
  };

  public render(): JSX.Element {
    const { isLoading, products, queryResults } = this.state;
    const { type } = this.props;
    const results = queryResults || products;
    return isLoading ? (
      <Loading size={100} />
    ) : (
      <Container>
        <H3 className="product-type__title">{type === "Cake" ? "Cakes" : "Creations"}</H3>
        <p className="product-type__description">-- Placeholder --</p>
        <p className="product-type__filter">
          To filter the products please click the pink button on the left hand side, and
          filter the results to your preferences.
        </p>
        <ProductsList products={results} noTitle type={type} />
      </Container>
    );
  }
}
