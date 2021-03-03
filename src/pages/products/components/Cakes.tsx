import { Container, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { breakpoints } from "../../../themes";
import ProductsList from "./ProductsList";

interface CakesProps {
  admin: boolean;
}

const Cakes = ({ admin }: CakesProps): JSX.Element => {
  const useStyles = makeStyles({
    text: {
      margin: "10px auto 20px",
      textAlign: "justify",
      lineHeight: 1.2,
      width: 800,
      [breakpoints.down("md")]: {
        width: 620,
      },
      [breakpoints.down("sm")]: {
        width: "90%",
      },
    },
  });
  const classes = useStyles();
  return (
    <div className="content-container">
      <Container>
        <Typography
          variant="h4"
          style={{
            paddingTop: 12,
          }}
        >
          Cakes
        </Typography>
        <Typography variant="subtitle1" className={classes.text}>
          All of our delicious cakes are baked with love on-site, using natural
          ingredients, and are fully customisable and ready to request. Whether you want
          some chocolate cupcakes for a party, or a princess themed birthday cake - just
          send a request and we&apos;ll get back to you as soon as possible with a quote!
        </Typography>
        <Typography
          variant="subtitle2"
          style={{
            margin: "10px 0",
            lineHeight: 1.1,
            color: "rgba(0, 0, 0, 0.7)",
          }}
        >
          To filter the products please click the pink button on the left hand side, and
          filter the results to your preferences.
        </Typography>
        <ProductsList type="Cake" admin={admin} />
      </Container>
    </div>
  );
};

export default Cakes;
