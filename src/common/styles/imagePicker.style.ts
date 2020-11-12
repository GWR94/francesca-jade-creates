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
  formContainer: {
    margin: 0,
    paddingBottom: 10,
  },
  formSection: {
    width: "200px",
    minWidth: "200px",
    boxShadow: "none",
    padding: 0,
    margin: 0,
  },
  sectionBody: {
    display: "none",
  },
  sectionHeader: {
    display: "none",
  },
  photoPickerButton: {
    background: "none",
    boxShadow:
      "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
    display: "block",
    padding: "6px 16px",
    minWidth: "64px",
    boxSizing: "border-box",
    fontSize: "0.9375rem",
    transition:
      "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 500,
    lineHeight: 1.75,
    borderRadius: "4px",
    letterSpacing: "0.02857em",
    textTransform: "uppercase",
    marginTop: 10,
  },
});
