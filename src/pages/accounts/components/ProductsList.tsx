import React from "react";
import { H3 } from "@blueprintjs/core";
import { Col, Row, Container } from "reactstrap";
import { useHistory } from "react-router-dom";
import Loading from "../../../common/Loading";
import Product from "../../../common/Product";
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
                onClick={(): void => history.push(`account/${product.id}`)}
                lg={3}
                md={4}
                sm={6}
                key={product.id}
                style={{ marginBottom: "30px" }}
              >
                <Product admin={admin} {...product} />
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
