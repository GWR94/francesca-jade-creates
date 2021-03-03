import { Container, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { FONTS, breakpoints } from "../../../themes";
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
            fontFamily: `${FONTS.Title}, sans-serif`,
          }}
        >
          Creations
        </Typography>
        <Typography variant="subtitle1" className={classes.text}>
          Finding the perfect gift which can be both memorable and give a long lasting
          impression can be a challenge - so we&apos;ve made it our goal to build bespoke,
          handcrafted gifts for every occasion. Whether it be a bespoke scrabble-themed
          frame, a personalised birthday card or even a little Christmas decoration gift,
          just select a product and we&apos;ll do the rest!
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
