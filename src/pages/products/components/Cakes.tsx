import { Container, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { breakpoints, COLORS } from "../../../themes";
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
      width: "80%",
      [breakpoints.down("md")]: {
        width: "90%",
      },
    },
    title: {
      paddingTop: 12,
      paddingBottom: 5,
      position: "relative",
      margin: "0 auto 20px",
      width: 200,
      borderBottom: `3px solid ${COLORS.DarkPink}`,
      textAlign: "center",
    },
  });
  const classes = useStyles();
  return (
    <div className="content-container">
      <Container>
        <Typography variant="h4" className={classes.title}>
          PERSONALISED CAKES
        </Typography>
        <Typography variant="subtitle1" className={classes.text}>
          Delicious hand-baked cakes for every occasion, whether it be a birthday cake for
          a kids birthday party, or a cake in celebration of an anniversary - we&apos;ve
          got you covered with our large selection of personalisable cakes!
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
