import React, { useEffect } from "react";
import { Typography, Container, makeStyles } from "@material-ui/core";
import { useDispatch } from "react-redux";
import ProductsList from "../../products/components/ProductsList";
import { FONTS, breakpoints } from "../../../themes";
import * as actions from "../../../actions/products.actions";

interface AdminProductProps {
  admin: boolean;
}

const AdminProducts: React.FC<AdminProductProps> = ({ admin }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.resetSearchFilters());
    dispatch(actions.getProducts());
  }, []);

  const useStyles = makeStyles({
    container: {
      margin: "0 auto",
      fontFamily: FONTS.Title,
      width: 800,
      [breakpoints.down("md")]: {
        width: 620,
      },
      [breakpoints.down("sm")]: {
        width: "90%",
      },
    },
    subtitle: {
      textAlign: "justify",
      margin: "auto 10px",
    },
  });
  const classes = useStyles();
  return (
    <>
      <div className={classes.container}>
        <Typography variant="h4" gutterBottom>
          Current Products
        </Typography>
        <Typography className={classes.subtitle} style={{ marginBottom: 10 }}>
          Here are a list of all of the products that customers can see when browsing the
          site. You can search through all of the products via the search feature by
          clicking the pink hamburger icon.
        </Typography>
        <Typography variant="subtitle2" style={{ margin: "10px auto" }}>
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
