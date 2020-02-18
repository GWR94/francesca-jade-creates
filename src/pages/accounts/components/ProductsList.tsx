import React from "react";
import { H3 } from "@blueprintjs/core";
import { Col, Row, Container } from "reactstrap";
import Loading from "../../../common/Loading";
import Product from "../../../common/Product";
import { ProductProps } from "../interfaces/Product.i";

interface ProductListProps {
  products: ProductProps[];
}

const ProductsList: React.FC<ProductListProps> = ({ products }): JSX.Element => {
  return (
    <Container>
      <H3>Products</H3>
      <Row>
        {products ? (
          products.map(
            (product: ProductProps): JSX.Element => (
              <Col lg={3} md={4} sm={6} key={product.id} style={{ marginBottom: "30px" }}>
                <Product {...product} />
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
