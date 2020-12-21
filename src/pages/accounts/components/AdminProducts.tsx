import React from "react";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { Typography, Container, makeStyles } from "@material-ui/core";
import ProductsList from "./ProductsList";
import { FONTS } from "../../../themes";

interface AdminProductProps {
  admin: boolean;
}

const AdminProducts: React.FC<AdminProductProps> = ({ admin }) => {
  const breakpoints = createBreakpoints({});
  const useStyles = makeStyles({
    container: {
      margin: "0 auto",
      fontFamily: FONTS.Title,
      width: 800,
      [breakpoints.down("md")]: {
        width: 620,
      },
      [breakpoints.down("sm")]: {
        width: "100%",
      },
    },
    subtitle: {
      textAlign: "center",
      margin: "0 5px",
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
          site.
        </Typography>
        <Typography className={classes.subtitle} style={{ marginBottom: 20 }}>
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
