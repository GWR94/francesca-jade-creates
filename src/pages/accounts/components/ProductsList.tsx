import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import ProductCard from "../../../common/product/ProductCard";
import { ProductProps } from "../../../common/interfaces/Product.i";
import { searchProducts } from "../../../graphql/queries";
import Pagination from "../../../common/Pagination";
import SearchFilter from "../../../common/SearchFilter";

interface ProductListProps {
  admin: boolean;
  noTitle?: boolean;
  products: ProductProps[];
  type?: "Cake" | "Creates";
}

interface FilterProps {
  or?: any[];
  and?: any[];
}

const ProductsList: React.FC<ProductListProps> = ({
  admin,
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

  const handleSearchQuery = async (query, searchTerms, adminFilters?): Promise<void> => {
    if (!query && !adminFilters) return setQueryResults(null);
    let filtering: FilterProps = {};

    if (searchTerms === "all") {
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
        [searchTerms]: {
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
      return setQueryResults(data.searchProducts.items);
    } catch (err) {
      return console.error(err);
    }
  };

  const results = queryResults || products;
  return (
    <>
      <SearchFilter
        admin={admin}
        setQuery={(query, filters, adminFilter): Promise<void> =>
          handleSearchQuery(query, filters, adminFilter)
        }
      />
      <Row>
        {results.length ? (
          results.slice(productRange.min, productRange.max).map(
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
    </>
  );
};

export default ProductsList;
