import React, { Component } from "react";
import { API } from "aws-amplify";
import { History } from "history";
import { Container, Typography } from "@material-ui/core";
import { listProducts } from "../../graphql/queries";
import Loading from "../Loading";
import { ProductProps } from "../interfaces/Product.i";
import ProductsList from "../../pages/accounts/components/ProductsList";

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

  public handleGetProducts = async (): Promise<void> => {
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
    const { type, history, admin } = this.props;
    const results = queryResults || products;
    return isLoading ? (
      <Loading size={100} />
    ) : (
      <Container>
        <Typography variant="h4" style={{ paddingTop: 12 }}>
          {type === "Cake" ? "Cakes" : "Creations"}
        </Typography>
        <Typography variant="subtitle1">-- Placeholder --</Typography>
        <Typography variant="subtitle2">
          To filter the products please click the pink button on the left hand side, and
          filter the results to your preferences.
        </Typography>
        <ProductsList
          products={results}
          noTitle
          type={type}
          history={history}
          admin={admin}
        />
      </Container>
    );
  }
}
