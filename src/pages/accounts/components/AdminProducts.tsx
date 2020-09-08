import React from "react";
import { Typography, Container } from "@material-ui/core";
import ProductsList from "./ProductsList";

interface AdminProductProps {
  admin: boolean;
}

const AdminProducts: React.FC<AdminProductProps> = ({ admin }) => {
  return (
    <>
      <div className="profile__container">
        <Typography variant="h4">Current Products</Typography>
        <Typography style={{ textAlign: "center", margin: "5px 10px" }}>
          Here are a list of all of the products that customers can see when browsing the
          site.
        </Typography>
        <Typography style={{ textAlign: "center", margin: "5px 0 20px" }}>
          To edit or delete products, click the 3 dots on the item you wish to change and
          click the relevant choice.
        </Typography>
      </div>
      <Container>
        <ProductsList admin={admin} />
      </Container>
    </>
  );
};

export default AdminProducts;
