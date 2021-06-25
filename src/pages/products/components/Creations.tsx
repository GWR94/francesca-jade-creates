import { Container, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { breakpoints, COLORS } from "../../../themes";
import ProductsList from "./ProductsList";

interface CreationProps {
  admin: boolean;
}

const Creations = ({ admin }: CreationProps): JSX.Element => {
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
      borderBottom: `3px solid ${COLORS.DarkGrey}`,
      textAlign: "center",
    },
  });
  const classes = useStyles();
  return (
    <div className="content-container">
      <Container>
        <Typography variant="h4" className={classes.title}>
          BESPOKE CREATIONS
        </Typography>
        <Typography variant="subtitle1" className={classes.text}>
          Finding the perfect gift which can be both memorable and give a long lasting
          impression can be a challenge - so we&apos;ve made it our goal to build bespoke,
          handcrafted gifts for every occasion.
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
        <ProductsList type="Creates" admin={admin} />
      </Container>
    </div>
  );
};

export default Creations;
