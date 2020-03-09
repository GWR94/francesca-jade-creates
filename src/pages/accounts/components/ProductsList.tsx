import React, { useState } from "react";
import { H3 } from "@blueprintjs/core";
import { Col, Row, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { useHistory } from "react-router-dom";
import Product from "../../../common/ProductCard";
import { ProductProps } from "../../../common/interfaces/Product.i";
import { API } from "aws-amplify";
import { searchProducts } from "../../../graphql/queries";
import Filter from "../../../common/Filter";

interface ProductListProps {
  admin: boolean;
  noTitle?: boolean;
  products: ProductProps[];
  type?: "Cake" | "Creates";
}

const ProductsList: React.FC<ProductListProps> = ({
  admin,
  noTitle,
  products,
  type,
}): JSX.Element => {
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [queryResults, setQueryResults] = useState(null);
  const productRange = {
    min: page === 1 ? 0 : (page - 1) * 12,
    max: page === 1 ? 12 : (page - 1) * 12 + 12,
  };
  const maxPages = Math.ceil(products.length / 12);

  const handleSearchQuery = async (query, searchTerms): Promise<void> => {
    if (!query) return setQueryResults(null);
    let filtering;
    if (searchTerms === "all") {
      filtering = {
        or: [
          { tags: { matchPhrasePrefix: query } },
          { title: { matchPhrasePrefix: query } },
          { description: { matchPhrasePrefix: query } },
        ],
        type: { eq: type === "Cake" ? "Cake" : "Creates" },
      };
    } else {
      filtering = {
        [searchTerms]: {
          matchPhrasePrefix: query,
        },
        type: { eq: type === "Cake" ? "Cake" : "Creates" },
      };
    }
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
  };

  const results = queryResults || products;

  return (
    <>
      {!noTitle && <H3 className="accounts__title">Products</H3>}
      <Filter
        handleSearchQuery={(query, filter): Promise<void> =>
          handleSearchQuery(query, filter)
        }
        admin={admin}
      />
      <Row>
        {results.length ? (
          results.slice(productRange.min, productRange.max).map(
            (product: ProductProps): JSX.Element => (
              <Col
                lg={3}
                md={4}
                sm={6}
                xs={12}
                key={product.id}
                style={{ marginBottom: "30px" }}
              >
                <Product admin={admin} product={product} history={history} />
              </Col>
            ),
          )
        ) : (
          <div>No Results</div>
        )}
      </Row>
      {products.length > 12 && (
        <div className="product-list__pagination">
          <Pagination aria-label="Choose page to view">
            <PaginationItem>
              <PaginationLink first onClick={(): void => setPage(1)} />
            </PaginationItem>
            <PaginationItem disabled={page === 1}>
              <PaginationLink previous onClick={(): void => setPage(page - 1)} />
            </PaginationItem>
            <PaginationItem active={page === 1}>
              <PaginationLink onClick={(): void => setPage(page === 1 ? 1 : page - 1)}>
                {page === 1 ? 1 : page - 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem active={page >= 2}>
              <PaginationLink onClick={(): void => setPage(page === 1 ? 2 : page)}>
                {page === 1 ? 2 : page}
              </PaginationLink>
            </PaginationItem>
            {page < maxPages && maxPages >= 3 && (
              <PaginationItem active={page === maxPages}>
                <PaginationLink onClick={(): void => setPage(page === 1 ? 3 : page + 1)}>
                  {page === 1 ? 3 : page + 1}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink next onClick={(): void => setPage(page + 1)} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink last onClick={(): void => setPage(maxPages)} />
            </PaginationItem>
          </Pagination>
        </div>
      )}
    </>
  );
};

export default ProductsList;
