import { createStyles } from "@material-ui/core";
import { COLORS, FONTS } from "../../../themes";

export default createStyles({
  selectContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 14,
  },
  sendButton: {
    color: COLORS.SuccessGreen,
    minWidth: 60,
  },
  trackingList: {
    fontFamily: FONTS.Title,
  },
  deleteIcon: {
    color: COLORS.ErrorRed,
    marginLeft: 5,
    cursor: "pointer",
  },
  dialog: {
    minWidth: "400px !important",
  },
});
