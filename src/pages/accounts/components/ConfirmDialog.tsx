import React from "react";
import { Dialog, Classes, Button, Tag, ProgressBar } from "@blueprintjs/core";
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
  return (
    isOpen && (
      <Dialog
        isOpen={isOpen}
        icon="info-sign"
        title="Are you sure this is correct?"
        onClose={closeModal}
      >
        <div className={Classes.DIALOG_BODY}>
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
        </div>
        <div className="new-product__button-container">
          <Button
            text="Edit"
            intent="warning"
            onClick={closeModal}
            style={{ margin: "6px 4px" }}
          />
          <Button
            text="Looks good!"
            intent="success"
            loading={isUploading}
            onClick={onProductCreate}
            style={{ margin: "6px 4px" }}
          />
        </div>
        {isUploading && <ProgressBar intent="primary" value={percentUploaded} />}
      </Dialog>
    )
  );
};

export default ConfirmDialog;
