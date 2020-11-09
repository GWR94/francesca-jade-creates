import { createStyles } from "@material-ui/core";
import { COLORS } from "../../themes/index";

export default createStyles({
  container: {
    display: "block",
  },
  centeredImageContainer: {
    display: "block",
    margin: "0 auto",
    maxWidth: 600,
  },
  deleteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    color: "#ff0062",
    cursor: "pointer",
    fontSize: 25,
    zIndex: 10,
    height: 20,
    width: 20,
    display: "block",
    "&:hover": {
      fontSize: 30,
      top: 3,
      right: 6,
    },
  },
  starIcon: {
    position: "absolute",
    top: 5,
    left: 5,
    color: "#ffc240",
    cursor: "pointer",
    fontSize: 25,
    zIndex: 10,
    height: 20,
    width: 20,
    display: "block",
    "&:hover": {
      fontSize: 30,
      top: 3,
      left: 6,
    },
  },
  svg: {
    fontSize: "50px !important",
    color: COLORS.Pink,
    transition: "5s font-size, color 1s !important",
    webkitTransition: "5s font-size, color 1s !important",
    mozTransition: "5s font-size, color 1s !important",
    oTransition: "5s font-size, color 1s !important",
    " &:hover": {
      fontSize: "60px !important",
      color: COLORS.DarkPink,
    },
  },
});
