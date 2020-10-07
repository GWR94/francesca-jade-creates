import React from "react";
import {
  Dialog,
  Button,
  LinearProgress,
  DialogTitle,
  DialogContent,
  CircularProgress,
  DialogActions,
  useMediaQuery,
  useTheme,
  makeStyles,
} from "@material-ui/core";
import { ConfirmDialogProps } from "../../pages/accounts/interfaces/ConfirmDialog.i";
import ImageCarousel from "../containers/ImageCarousel";
import ChipContainer from "../inputs/ChipContainer";
import { FONTS } from "../../themes";
import { getProductPrice } from "../../utils";

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  product,
  isUploading,
  imagePreview,
  onProductCreate,
  closeModal,
  percentUploaded,
}): JSX.Element | null => {
  const { title, tagline, description, type, tags, images } = product;
  const theme = useTheme();
  const useStyles = makeStyles({
    dialogContainer: {
      fontFamily: FONTS.Title,
    },
  });
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  if (!isOpen) return null;
  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      scroll="body"
      className={classes.dialogContainer}
      fullScreen={fullScreen}
    >
      <DialogTitle>Confirm your product is correct</DialogTitle>
      <DialogContent>
        <p>
          <strong>Title: </strong>
          {title}
        </p>
        <p>
          <strong>Tag line: </strong>
          {tagline}
        </p>
        <p>
          <strong>Description:</strong>
        </p>
        <p
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
        <p>
          <strong>Type: </strong>
          {type}
        </p>
        <p>
          <strong>Price: </strong>
          {getProductPrice(product, true)}
        </p>
        <p>
          <strong>Tags: </strong>
        </p>
        {tags?.length > 0 ? <ChipContainer tags={tags} type={type} /> : "No tags"}
        <p>
          <strong>Cover image:</strong>
        </p>
        {imagePreview ? (
          <img
            src={imagePreview}
            alt={`${title} Preview`}
            style={{
              display: "block",
              width: 340,
              margin: "0 auto",
            }}
          />
        ) : (
          <ImageCarousel images={images.collection} type={type} />
        )}
        <DialogActions>
          <Button color="secondary" onClick={closeModal} style={{ margin: "6px 4px" }}>
            Edit
          </Button>
          <Button color="primary" onClick={onProductCreate} style={{ margin: "6px 4px" }}>
            {isUploading ? <CircularProgress /> : "Looks good!"}
          </Button>
        </DialogActions>
        {isUploading && <LinearProgress color="primary" value={percentUploaded} />}
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
