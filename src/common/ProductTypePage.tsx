import React, { Component } from "react";
import { API } from "aws-amplify";
import { History } from "history";
import { Container } from "reactstrap";
import { listProducts, searchProducts } from "../graphql/queries";
import Loading from "./Loading";
import { ProductProps } from "./interfaces/Product.i";
import ProductsList from "../pages/accounts/components/ProductsList";
import Filter from "./Filter";

interface ProductTypeState {
  isLoading: boolean;
  products: ProductProps[];
  queryResults: ProductProps[];
}

interface ProductTypeProps {
  admin?: boolean;
  history: History;
  type: string;
}

/**
 * TODO
 * [ ] Fix creates showing up in cakes etc.
 */

export default class ProductTypePage extends Component<
  ProductTypeProps,
  ProductTypeState
> {
  public readonly state: ProductTypeState = {
    isLoading: true,
    products: null,
    queryResults: [],
  };

  public componentDidMount(): void {
    this.handleGetProducts();
  }

  private handleSearchQuery = async (query, searchTerms): Promise<void> => {
    let filtering;
    if (searchTerms === "all") {
      filtering = {
        or: [
          { tags: { matchPhrasePrefix: query } },
          { title: { matchPhrasePrefix: query } },
          { description: { matchPhrasePrefix: query } },
        ],
      };
    } else {
      filtering = {
        [searchTerms]: {
          matchPhrasePrefix: query,
        },
      };
    }
    const { data } = await API.graphql({
      query: searchProducts,
      variables: {
        filter: filtering,
      },
      // @ts-ignore
      authMode: "API_KEY",
    });
    this.setState({ products: data.searchProducts.items });
  };

  private handleGetProducts = async (): Promise<void> => {
    const { type } = this.props;
    const filtering =
      type === "Cake"
        ? {
            type: {
              eq: "Cake",
            },
          }
        : {
            type: {
              ne: "Cake",
            },
          };
    const { data } = await API.graphql({
      query: listProducts,
      variables: {
        filter: filtering,
      },
      // @ts-ignore
      authMode: "API_KEY",
    });
    this.setState({ products: data.listProducts.items, isLoading: false });
  };

  public render(): JSX.Element {
    const { isLoading, products, queryResults } = this.state;
    const { admin, history, handleSearchQuery } = this.props;

    const results = queryResults.length ? queryResults : products;
    return isLoading ? (
      <Loading size={100} />
    ) : (
      <Container>
        <Filter
          handleSearchQuery={(query, filter): Promise<void> =>
            this.handleSearchQuery(query, filter)
          }
        />
        <ProductsList products={results} admin={admin} noTitle />
      </Container>
    );
  }
}
