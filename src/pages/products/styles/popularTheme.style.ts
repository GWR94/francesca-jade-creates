import { createStyles } from "@material-ui/core";
import { FONTS, breakpoints } from "../../../themes";
import family from "../../../img/juliane-liebermann-O-RKu3Aqnsw-unsplash.jpg";
import brands from "../../../img/jose-gil-rgBKvQWdtPE-unsplash.jpg";
import kids from "../../../img/justin-lim-tloFnD-7EpI-unsplash.jpg";
import birthday from "../../../img/joshua-hoehne-wnHeb_pRJBo-unsplash.jpg";
import love from "../../../img/nick-karvounis-UA3zSV9ze8U-unsplash.jpg";
import baby from "../../../img/mutzii-ct9-ohXBz6I-unsplash.jpg";
import friends from "../../../img/simon-maage-tXiMrX3Gc-g-unsplash.jpg";
import memory from "../../../img/laura-fuhrman-73OJLcahQHg-unsplash.jpg";

export default createStyles({
  outerContainer: {
    width: "100%",
    margin: "0 auto",
    display: "flex",
    color: "rgba(255,255,255, 0.7)",
    flexWrap: "nowrap",
    [breakpoints.down("md")]: {
      flexWrap: "wrap",
      width: "100%",
    },
  },
  img: {
    width: "100%",
    padding: 0,
    margin: 0,
    display: "block",
  },
  root: {
    display: "block",
    width: "100%",
    clear: "both",
  },
  container: {
    width: "25%",
    height: 300,
    transition: "width 500ms, background-size 500ms",
    cursor: "pointer",
    [breakpoints.down("md")]: {
      width: "50%",
      flexWrap: "wrap",
    },
    [breakpoints.down("xs")]: {
      height: 200,
    },
  },
  containerMobile: {
    width: "50%",
    height: 300,
    flexWrap: "wrap",
    [breakpoints.down("xs")]: {
      height: 200,
    },
  },
  containerLG: {
    width: "40% !important",
    transition: "width 500ms, background-size 500ms",
    height: 300,
    cursor: "pointer",
  },
  containerXS: {
    width: "20% !important",
    transition: "width 500ms, background-size 500ms",
    cursor: "pointer",
    height: 300,
  },
  brands: {
    background: `linear-gradient(to bottom, rgba(168, 50, 50, 0.32), rgba(138, 0, 0, 0.32)),
    url(${brands}) no-repeat center center`,
    "&:hover": {
      "&:before": {
        background: `linear-gradient(to bottom, rgba(168, 50, 50, 0.52), rgba(138, 0, 0, 0.52)),
    url(${brands}) no-repeat center center`,
      },
    },
  },
  love: {
    background: `linear-gradient(to bottom, rgba(240, 10, 79, 0.3), rgba(156, 10, 240, 0.33)),
    url(${love}) no-repeat center center`,
    "&:hover": {
      "&:before": {
        background: `linear-gradient(to bottom, rgba(240, 10, 79, 0.53), rgba(156, 10, 240, 0.53)),
    url(${love}) no-repeat center center`,
      },
    },
  },
  family: {
    background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.32)),
    url(${family}) no-repeat center center`,
    "&:hover": {
      "&:before": {
        background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0.52)),
    url(${family}) no-repeat center center`,
      },
    },
  },
  kids: {
    background: `linear-gradient(to top, rgba(252, 82, 3, 0.32), rgba(252, 132, 3, 0.33)),
    url(${kids}) no-repeat center center`,
    "&:hover": {
      "&:before": {
        background: `linear-gradient(to top, rgba(252, 82, 3, 0.53), rgba(252, 132, 3, 0.53)),
    url(${kids}) no-repeat center center`,
      },
    },
  },
  birthday: {
    background: `linear-gradient(to bottom, rgba(66, 245, 132, 0.32), rgba(66, 245, 224, 0.33)),
    url(${birthday}) no-repeat center center`,
    "&:hover": {
      "&:before": {
        background: `linear-gradient(to bottom, rgba(66, 245, 132, 0.53), rgba(66, 245, 224, 0.53)),
    url(${birthday}) no-repeat center center`,
      },
    },
  },
  memory: {
    background: `linear-gradient(to bottom, rgba(252, 3, 102, 0.3), rgba(252, 3, 20, 0.33)),
    url(${memory}) no-repeat center center`,
    "&:hover": {
      "&:before": {
        background: `linear-gradient(to bottom, rgba(252, 3, 102, 0.53), rgba(252, 3, 20, 0.53)),
    url(${memory}) no-repeat center center`,
      },
    },
  },
  baby: {
    background: `linear-gradient(to top, rgba(70, 199, 184, 0.3), rgba(25, 142, 166, 0.3)),
    url(${baby}) no-repeat center center`,
    "&:hover": {
      "&:before": {
        background: `linear-gradient(to top, rgba(70, 199, 184, 0.53), rgba(25, 142, 166, 0.53)),
    url(${baby}) no-repeat center center`,
      },
    },
  },
  friends: {
    background: `linear-gradient(to bottom, rgba(240, 10, 79, 0.3), rgba(156, 10, 240, 0.33)),
    url(${friends}) no-repeat center center`,
    "&:hover": {
      "&:before": {
        background: `linear-gradient(to bottom, rgba(240, 10, 79, 0.53), rgba(156, 10, 240, 0.53)),
    url(${friends}) no-repeat center center`,
      },
    },
  },
  wrap: {
    position: "relative",
    height: "100%",
    width: "100%",
    backgroundSize: "cover",
    "&:before": {
      backgroundSize: "cover",
      content: "''",
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
      zIndex: 1,
    },
    "&:hover": {
      "&:before": {
        backgroundSize: "cover",
        content: "''",
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        zIndex: 1,
      },
    },
  },
  title: {
    position: "absolute",
    bottom: 10,
    fontFamily: FONTS.Title,
    fontSize: "1.25rem",
    fontWeight: "bolder",
    textTransform: "uppercase",
    [breakpoints.down("md")]: {
      fontSize: "1.3rem",
    },
    [breakpoints.down("sm")]: {
      fontSize: "1rem",
    },
  },
  subtitle: {
    fontFamily: FONTS.Title,
    fontWeight: "bold",
    textAlign: "center",
    width: "80%",
    fontSize: "1.1rem",
    [breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
  },
  text: {
    position: "relative",
    height: "100%",
    width: "100%",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
