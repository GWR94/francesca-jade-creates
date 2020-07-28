import React from "react";
import { Typography, Container } from "@material-ui/core";
import { History } from "history";
import ProductsList from "./ProductsList";
import { ProductProps } from "../interfaces/Product.i";
import TabNavigation from "./TabNavigation";

interface AdminProductProps {
  history: History;
  admin: boolean;
  products: ProductProps[];
}

const AdminProducts: React.FC<AdminProductProps> = ({ history, admin, products }) => {
  return (
    <>
      <TabNavigation current="products" admin={admin} />
      <div className="profile__container">
        <Typography variant="h4">Current Products</Typography>
        <Typography style={{ textAlign: "center", margin: "5px 0" }}>
          Here are a list of all of the products that customers can see when browsing the
          site.
        </Typography>
        <Typography style={{ textAlign: "center", margin: "5px 0 20px" }}>
          To edit or delete products, click the 3 dots on the item you wish to change and
          click the relevant choice.
        </Typography>
      </div>
      <Container>
        <ProductsList history={history} products={products} admin={admin} />
      </Container>
    </>
  );
};

export default AdminProducts;
