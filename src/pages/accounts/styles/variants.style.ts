import { createStyles } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { COLORS } from "../../../themes";

const breakpoints = createBreakpoints({});

export default createStyles({
  customisableContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: 300,
    alignItems: "center",
    margin: "10px auto 0",
    [breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  chipCake: {
    background: COLORS.Gray,
  },
  chipCreates: {
    background: COLORS.Pink,
  },
  chipInput: {
    paddingBottom: 6,
  },
  straightInputRight: {
    borderTopRightRadius: "0 !important",
    borderBottomRightRadius: "0 !important",
  },
  straightInputLeft: {
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  removeIcon: {
    fontSize: "1rem",
    color: COLORS.ErrorRed,
    cursor: "pointer",
    marginLeft: 5,
  },
  editIcon: {
    fontSize: "0.8rem",
    color: COLORS.InfoBlue,
    cursor: "pointer",
    marginLeft: 5,
  },
  renderedOptions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
  addFeatureButton: {
    display: "block",
    margin: "auto",
  },
  typeContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  formControl: {
    width: "100%",
  },
  input: {
    borderRadius: 0,
    borderLeft: "0px solid transparent", //FIXME
    borderRight: "0px solid transparent", //FIXME
  },
  name: {
    fontWeight: "bold",
  },
  feature: {
    margin: "0 0 7px",
  },
  variantTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    fontSize: "1.1rem",
  },
});
