import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import ProductCard from "../../../common/product/ProductCard";
import { ProductProps } from "../../../common/interfaces/Product.i";
import { searchProducts } from "../../../graphql/queries";
import Pagination from "../../../common/Pagination";
import SearchFilter from "../../../common/SearchFilter";
import { Drawer } from "@blueprintjs/core";

/**
 * TODO
 * [ ] Tab that opens filters on mobile instead of always showing
 */
interface ProductListProps {
  admin?: boolean;
  noTitle?: boolean;
  products: ProductProps[];
  type?: "Cake" | "Creates";
}

interface FilterProps {
  or?: any[];
  and?: any[];
}

const ProductsList: React.FC<ProductListProps> = ({
  admin = false,
  products,
  type,
}): JSX.Element => {
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [queryResults, setQueryResults] = useState(products);
  const productRange = {
    min: page === 1 ? 0 : (page - 1) * 12,
    max: page === 1 ? 12 : (page - 1) * 12 + 12,
  };
  const maxPages = Math.ceil(products.length / 12);
  const [sortMethod, setSortMethod] = useState("createdAt");
  const [filterOpen, setFilterOpen] = useState(false);

  const handleSearchQuery = async (query, filters): Promise<void> => {
    const { searchQuery, adminFilters, sortBy } = filters;
    if (!query && !adminFilters) return setQueryResults(null);
    let filtering: FilterProps = {};
    setSortMethod(sortBy);

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
      return setQueryResults(null);
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
      console.log(data.searchProducts.items);
      return setQueryResults(data.searchProducts.items);
    } catch (err) {
      return console.error(err);
    }
  };

  const results = queryResults || products;
  return (
    <>
      <div
        className="product-list__filter-container"
        onClick={(): void => setFilterOpen(true)}
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
          setPage={(page): void => setPage(page)}
          page={page}
        />
      )}
      <Drawer
        isOpen={filterOpen}
        hasBackdrop={false}
        onClose={(): void => setFilterOpen(false)}
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
          setQuery={(query, filters): Promise<void> => handleSearchQuery(query, filters)}
          admin={admin}
        />
      </Drawer>
    </>
  );
};

export default ProductsList;
