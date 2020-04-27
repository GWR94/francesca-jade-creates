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
} from "@material-ui/core";
import { ConfirmDialogProps } from "../interfaces/ConfirmDialog.i";
import ImageCarousel from "../../../common/ImageCarousel";
import TagsInput from "../../../common/TagsInput";

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  type,
  setPrice,
  productCost,
  shippingCost,
  isUploading,
  imagePreview,
  onProductCreate,
  closeModal,
  percentUploaded,
  tags,
  image,
}): JSX.Element => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  return (
    isOpen && (
      <Dialog open={isOpen} onClose={closeModal} scroll="body" fullScreen={fullScreen}>
        <DialogTitle>Confirm your product is correct</DialogTitle>
        <DialogContent>
          <p>
            <strong>Title: </strong>
            {title}
          </p>
          <p>
            <strong>Description: </strong>
            {description}
          </p>
          <p>
            <strong>Type: </strong>
            {type}
          </p>
          {setPrice ? (
            <>
              <p>
                <strong>Product price:</strong> £{parseFloat(productCost).toFixed(2)}
              </p>
              <p>
                <strong>Shipping cost:</strong> £{parseFloat(shippingCost).toFixed(2)}
              </p>
            </>
          ) : (
            <p>
              <strong>Prices: </strong>
              No set price - customer requests a quote.
            </p>
          )}
          <p>
            <strong>Tags: </strong>
          </p>
          {tags?.length > 0 ? <TagsInput tags={tags} type={type} /> : "No tags"}

          <p>
            <strong>Cover image:</strong>
          </p>
          {imagePreview ? (
            <img src={imagePreview} alt={`${title} Preview`} className="confirm__image" />
          ) : (
            <ImageCarousel images={image} />
          )}
          <DialogActions>
            <Button color="secondary" onClick={closeModal} style={{ margin: "6px 4px" }}>
              Edit
            </Button>
            <Button
              color="primary"
              onClick={onProductCreate}
              style={{ margin: "6px 4px" }}
            >
              {isUploading ? <CircularProgress /> : "Looks good!"}
            </Button>
          </DialogActions>
          {isUploading && <LinearProgress color="primary" value={percentUploaded} />}
        </DialogContent>
      </Dialog>
    )
  );
};

export default ConfirmDialog;
