import { Button, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { COLORS, breakpoints } from "../../themes";
import missingImg from "../../img/404.svg";

const NotFoundPage = (): JSX.Element => {
  const useStyles = makeStyles({
    container: {
      position: "absolute",
      top: "50%",
      marginTop: -270,
      height: 400,
      textAlign: "center",
      width: 300,
      left: "50%",
      marginLeft: -150,
      [breakpoints.down("sm")]: {
        marginTop: -220,
        height: 300,
      },
    },
    img: {
      width: 200,
      marginBottom: 10,
      [breakpoints.up("sm")]: {
        width: "100%",
      },
    },
    outerContainer: {
      height: "95%",
    },
    mainText: {
      color: COLORS.DarkPink,
      fontWeight: "bolder",
    },
    subText: {
      color: "rgba(0,0,0,0.7)",
    },
    cakesButton: {
      border: `1px solid ${COLORS.DarkPink}`,
      color: COLORS.DarkPink,
      fontWeight: "bold",
      marginRight: 5,
      marginTop: 30,
    },
    createsButton: {
      border: `1px solid ${COLORS.DarkGrey}`,
      color: COLORS.DarkGrey,
      fontWeight: "bold",
      marginLeft: 5,
      marginTop: 30,
    },
  });
  const classes = useStyles();
  return (
    <div className="content-container" style={{ position: "relative" }}>
      <div className={classes.outerContainer}>
        <div className={classes.container}>
          <img src={missingImg} alt="404 - Page not found" className={classes.img} />
          <Typography variant="h3" className={classes.mainText}>
            404
          </Typography>
          <Typography variant="h5" className={classes.subText} gutterBottom>
            Page not found.
          </Typography>
          <>
            <Button variant="outlined" color="inherit" className={classes.cakesButton}>
              View Cakes
            </Button>
            <Button variant="outlined" color="inherit" className={classes.createsButton}>
              View Creations
            </Button>
          </>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
