import { createStyles } from "@material-ui/core";
import { FONTS, breakpoints } from "../../../themes";
import family from "../../../img/juliane-liebermann-O-RKu3Aqnsw-unsplash.jpg";
import brands from "../../../img/erik-mclean-chONWCBc7_w-unsplash.jpg";
import love from "../../../img/freestocks-r_oV6smBBYk-unsplash.jpg";
import kids from "../../../img/justin-lim-tloFnD-7EpI-unsplash.jpg";
import birthday from "../../../img/joshua-hoehne-wnHeb_pRJBo-unsplash.jpg";
import wedding from "../../../img/nick-karvounis-UA3zSV9ze8U-unsplash.jpg";
import baby from "../../../img/fe-ngo-bvx3G7RkOts-unsplash.jpg";
import friends from "../../../img/simon-maage-tXiMrX3Gc-g-unsplash.jpg";

export default createStyles({
  outerContainer: {
    width: "100%",
    margin: "0 auto",
    display: "flex",
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
  containerLarge: {
    width: "40%",
    transition: "width 500ms, background-size 500ms",
    height: 300,
    cursor: "pointer",
  },
  containerSmall: {
    width: "20%",
    transition: "width 500ms, background-size 500ms",
    cursor: "pointer",
    height: 300,
  },
  containerTwoLarge: {
    width: "65% !important",
    height: 300,
    cursor: "pointer",
    transition: "width 500ms, background-size 500ms",
  },
  containerTwoSmall: {
    width: "35% !important",
    height: 300,
    cursor: "pointer",
    transition: "width 500ms, background-size 500ms",
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
  brands: {
    background: `linear-gradient(to bottom, rgba(130, 178, 255, 0.52), rgba(156, 245, 255, 0.52)),
    url(${brands}) no-repeat center center`,
    "&:hover": {
      "&:before": {
        background: `linear-gradient(to bottom, rgba(130, 178, 255, 0.62), rgba(156, 245, 255, 0.62)),
    url(${brands}) no-repeat center center`,
      },
    },
  },
  love: {
    background: `linear-gradient(to bottom, rgba(255, 0, 0, 0.42), rgba(255, 72, 0, 0.43)),
    url(${love}) no-repeat center center`,
    "&:hover": {
      "&:before": {
        background: `linear-gradient(to bottom, rgba(255, 0, 0, 0.53), rgba(255, 72, 0, 0.53)),
    url(${love}) no-repeat center center`,
      },
    },
  },
  family: {
    background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.42)),
    url(${family}) no-repeat center center`,
    "&:hover": {
      "&:before": {
        background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.22), rgba(0, 0, 0, 0.22)),
    url(${family}) no-repeat center center`,
      },
    },
  },
  kids: {
    background: `linear-gradient(to bottom, rgba(255, 208, 0, 0.32), rgba(225, 255, 0, 0.33)),
    url(${kids}) no-repeat center center`,
    "&:hover": {
      "&:before": {
        background: `linear-gradient(to bottom, rgba(255, 208, 0, 0.43), rgba(225, 255, 0, 0.43)),
    url(${kids}) no-repeat center center`,
      },
    },
  },
  birthday: {
    background: `linear-gradient(to bottom, rgba(66, 245, 132, 0.32), rgba(66, 245, 224, 0.33)),
    url(${birthday}) no-repeat center center`,
    "&:hover": {
      "&:before": {
        background: `linear-gradient(to bottom, rgba(66, 245, 132, 0.43), rgba(66, 245, 224, 0.43)),
    url(${birthday}) no-repeat center center`,
      },
    },
  },
  wedding: {
    background: `linear-gradient(to bottom, rgba(240, 10, 79, 0.3), rgba(156, 10, 240, 0.33)),
    url(${wedding}) no-repeat center center`,
    "&:hover": {
      "&:before": {
        background: `linear-gradient(to bottom, rgba(240, 10, 79, 0.43), rgba(156, 10, 240, 0.43)),
    url(${wedding}) no-repeat center center`,
      },
    },
  },
  baby: {
    background: `linear-gradient(to bottom, rgba(255, 209, 254, 0.3), rgba(209, 211, 255, 0.33)),
    url(${baby}) no-repeat center center`,
    "&:hover": {
      "&:before": {
        background: `linear-gradient(to bottom, rgba(255, 209, 254, 0.43), rgba(209, 211, 255, 0.43)),
    url(${baby}) no-repeat center center`,
      },
    },
  },
  friends: {
    background: `linear-gradient(to bottom, rgba(240, 10, 79, 0.3), rgba(156, 10, 240, 0.33)),
    url(${friends}) no-repeat center center`,
    "&:hover": {
      "&:before": {
        background: `linear-gradient(to bottom, rgba(240, 10, 79, 0.43), rgba(156, 10, 240, 0.43)),
    url(${friends}) no-repeat center center`,
      },
    },
  },
  wrap: {
    position: "relative",
    height: "100%",
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
    fontFamily: FONTS.Text,
    fontSize: "1.7rem",
    fontWeight: "bold",
  },
});
