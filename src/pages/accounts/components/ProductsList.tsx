import React from "react";
import { Col, Row } from "reactstrap";
import { Drawer } from "@blueprintjs/core";
import { API } from "aws-amplify";
import ProductCard from "../../../common/product/ProductCard";
import { ProductProps } from "../../../common/interfaces/Product.i";
import { searchProducts } from "../../../graphql/queries";
import Pagination from "../../../common/Pagination";
import SearchFilter from "../../../common/SearchFilter";
import {
  ProductListProps,
  ProductListState,
  FilterProps,
} from "../interfaces/ProductList.i";

/**
 * TODO
 * [ ] Tab that opens filters on mobile instead of always showing
 */

class ProductsList extends React.Component<ProductListProps, ProductListState> {
  public readonly state: ProductListState = {
    page: 1,
    queryResults: this.props.products,
    sortMethod: "createdAt",
    filterOpen: false,
  };

  public handleSearchQuery = async (query, filters): Promise<void> => {
    const { type } = this.props;
    const { searchQuery, adminFilters, sortBy } = filters;
    if (!query && !adminFilters) return this.setState({ queryResults: null });
    let filtering: FilterProps = {};
    this.setState({ sortMethod: sortBy });
    if (searchQuery === "all") {
      if (query.length > 0) {
        filtering = {
          or: [
            { tags: { matchPhrasePrefix: query } },
            { title: { matchPhrasePrefix: query } },
            { description: { matchPhrasePrefix: query } },
          ],
        };
      }
    } else {
      filtering = {
        [searchQuery]: {
          matchPhrasePrefix: query,
        },
      };
    }

    if (adminFilters) {
      if (adminFilters === "cakes") {
        filtering.and = [{ type: { eq: "Cake" } }];
      } else if (adminFilters === "creates") {
        filtering.and = [{ type: { eq: "Creates" } }];
      }
    } else {
      filtering.and = [{ type: { eq: type } }];
    }

    if (Object.keys(filtering).length === 0 && filtering.constructor === Object) {
      return this.setState({ queryResults: null });
    }

    try {
      const { data } = await API.graphql({
        query: searchProducts,
        variables: {
          filter: filtering,
          limit: 100,
        },
        // @ts-ignore
        authMode: "API_KEY",
      });
      console.log(data.searchProducts);
      return this.setState({ queryResults: data.searchProducts.items });
    } catch (err) {
      return console.error(err);
    }
  };

  public render(): JSX.Element {
    const { queryResults, sortMethod, page, filterOpen } = this.state;
    const { products, admin, history } = this.props;

    const results = queryResults || products;

    const maxPages = Math.ceil(products.length / 12);
    const productRange = {
      min: page === 1 ? 0 : (page - 1) * 12,
      max: page === 1 ? 12 : (page - 1) * 12 + 12,
    };

    return (
      <>
        <div
          className="product-list__filter-container"
          onClick={(): void => this.setState({ filterOpen: true })}
          role="button"
          tabIndex={0}
        >
          <i className="fas fa-bars product-list__filter-icon animated infinite pulse" />
        </div>
        <Row style={{ padding: "0 20px" }}>
          {results.length ? (
            results
              .sort((a, b) => (a[sortMethod] < b[sortMethod] ? 1 : -1))
              .slice(productRange.min, productRange.max)
              .map(
                (product: ProductProps): JSX.Element => (
                  <Col
                    lg={4}
                    sm={6}
                    xs={12}
                    key={product.id}
                    style={{ marginBottom: "30px" }}
                  >
                    <ProductCard admin={admin} product={product} history={history} />
                  </Col>
                ),
              )
          ) : (
            <div className="product-list__no-result-container">No Results</div>
          )}
        </Row>
        {results.length > 12 && (
          <Pagination
            maxPages={maxPages}
            setPage={(page): void => this.setState({ page })}
            page={page}
          />
        )}
        <Drawer
          isOpen={filterOpen}
          hasBackdrop={false}
          onClose={(): void => this.setState({ filterOpen: false })}
          position="top"
          size="auto"
          style={{
            margin: "0 auto",
            maxWidth: "400px",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
          }}
        >
          <SearchFilter
            setQuery={(query, filters): Promise<void> =>
              this.handleSearchQuery(query, filters)
            }
            admin={admin}
          />
        </Drawer>
      </>
    );
  }
}

export default ProductsList;
