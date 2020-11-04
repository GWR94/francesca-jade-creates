import { createStyles } from "@material-ui/core";
import { COLORS } from "../../../themes";

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
    minWidth: 120,
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
