import { makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { COLORS } from "../../themes";

const Footer = (): JSX.Element => {
  const useStyles = makeStyles({
    container: {
      borderTop: `3px solid ${COLORS.LightPink}`,
      width: "100%",
      height: 30,
      position: "relative",
      bottom: 0,
      background: COLORS.PaleWhite,
      display: "flex",
      alignItems: "center",
      zIndex: 5,
    },
  });
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography variant="caption">
        <a
          style={{ textDecoration: "none", color: "#000" }}
          href="https://www.james-gower.dev/"
        >
          James Gower © 2020
        </a>
      </Typography>
    </div>
  );
};

export default Footer;
