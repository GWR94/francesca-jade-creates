import React from "react";
import { Dialog, Classes, Button, Tag, ProgressBar } from "@blueprintjs/core";
import { S3Image } from "aws-amplify-react";
import { ConfirmDialogProps } from "../interfaces/ConfirmDialog.i";

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  confirmDialogOpen,
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
  product,
  update,
}): JSX.Element => {
  return (
    <Dialog
      isOpen={confirmDialogOpen}
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
          {tags.length > 0
            ? tags.map(
                (tag, i): JSX.Element => (
                  <Tag active key={i} style={{ marginRight: "4px" }}>
                    {tag}
                  </Tag>
                ),
              )
            : "No tags"}
        </p>
        <p>
          <strong>Cover image:</strong>
        </p>
        {imagePreview ? (
          <img src={imagePreview} alt={`${title} Preview`} className="confirm__image" />
        ) : (
          update &&
          product.image && (
            <S3Image
              imgKey={product.image.key}
              theme={{
                photoImg: {
                  display: "block",
                  width: "340px",
                  margin: "0 auto",
                },
              }}
            />
          )
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
  );
};

export default ConfirmDialog;
