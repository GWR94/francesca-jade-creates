import { createStyles } from "@material-ui/core";
import { breakpoints, COLORS } from "../../../themes/index";

export default createStyles({
  chip: {
    background: COLORS.DarkPink,
    "&:hover": {
      background: COLORS.Pink,
    },
    "&:focus": {
      background: COLORS.Pink,
    },
  },
  formControl: {
    margin: 8,
    width: "80%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  uploadedImageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  imageLabel: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  buttonContainer: {
    width: "100%",
    display: "inline-flex",
    justifyContent: "space-evenly",
  },
  previewImage: {
    marginBottom: 8,
    width: 220,
  },
});
