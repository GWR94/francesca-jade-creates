import { createStyles } from "@material-ui/core";

export default createStyles({
  imageContainer: {
    display: "block",
    margin: "15px auto 10px",
    borderRadius: "50%",
    height: 160,
    width: 160,
    overflow: "hidden",
    MozBorderRadius: "50%",
    WebkitBorderRadius: "50%",
  },
  image: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "100%",
  },
  placeholderImage: {},
});
