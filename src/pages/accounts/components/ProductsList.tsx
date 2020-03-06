import React from "react";
import { H3 } from "@blueprintjs/core";
import { Col, Row, Container } from "reactstrap";
import { useHistory } from "react-router-dom";
import Loading from "../../../common/Loading";
import Product from "../../../common/ProductCard";
import { ProductProps } from "../../../common/interfaces/Product.i";

interface ProductListProps {
  products: ProductProps[];
  admin: boolean;
}

const ProductsList: React.FC<ProductListProps> = ({ products, admin }): JSX.Element => {
  const history = useHistory();
  return (
    <Container>
      <H3>Products</H3>
      <Row>
        {products ? (
          products.map(
            (product: ProductProps): JSX.Element => (
              <Col
                onClick={(): void => history.push(`/account/${product.id}`)}
                lg={4}
                sm={12}
                xs={{ size: 10, offset: 1 }}
                key={product.id}
                style={{ marginBottom: "30px" }}
              >
                <Product admin={admin} product={product} history={history} />
              </Col>
            ),
          )
        ) : (
          <Loading size={100} />
        )}
      </Row>
    </Container>
  );
};

export default ProductsList;
