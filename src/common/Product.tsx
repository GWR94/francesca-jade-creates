import React, { useState } from "react";
import { Card, Button, Alert, Tag } from "@blueprintjs/core";
import { API, graphqlOperation } from "aws-amplify";
import { S3Image } from "aws-amplify-react";
import ReactModal from "react-modal";
import { ProductProps } from "./interfaces/Product.i";
import { deleteProduct } from "../graphql/mutations";
import { Toaster } from "../utils/index";
import NewProduct from "../pages/accounts/components/NewProduct";
import useScreenWidth from "../hooks/useScreenWidth";

const Product: React.FC<ProductProps> = (product): JSX.Element => {
  const {
    id,
    image,
    title,
    description,
    price,
    shippingCost,
    type,
    tags,
    customer,
  } = product;
  const [deleteAlertOpen, setDeleteAlert] = useState(false);
  const [editDialogOpen, setEditDialog] = useState(false);
  const desktop = useScreenWidth(768);

  const handleDeleteProduct = async (): Promise<void> => {
    try {
      await API.graphql(graphqlOperation(deleteProduct, { input: { id } }));
      setDeleteAlert(false);
      Toaster.show({
        intent: "success",
        message: `${title} has been successfully removed.`,
      });
    } catch (err) {
      Toaster.show({
        intent: "danger",
        message: `${title} could not be removed.
        Please try again`,
      });
    }
  };

  const desktopStyles = {
    content: {
      position: "absolute",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      borderRadius: "4px",
      outline: "none",
      padding: "20px",
      overflowY: "scroll",
      height: "80%",
      transform: "translate(-50%, -50%)",
    },
  };

  const mobileStyles = {
    content: {
      margin: "0 auto",
      width: "90vw",
      display: "block",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-52%, -50%)",
      overflowY: "scroll",
      height: "80%",
    },
  };

  return (
    <>
      <Card elevation={2} interactive className="product__card">
        <p>
          <strong>{title}</strong> - <em>{type}</em>
        </p>
        <p>
          <em>{description}</em>
        </p>
        <p>
          {price > 0
            ? `£${price.toFixed(2)} + £${shippingCost.toFixed(2)} postage`
            : "No set price"}
        </p>
        {tags && (
          <div>
            {tags.map(
              (tag, i): JSX.Element => (
                <Tag active key={i} style={{ margin: "0px 4px 4px" }}>
                  {tag}
                </Tag>
              ),
            )}
          </div>
        )}
        <div id="s3Image">
          <S3Image
            imgKey={image.key}
            theme={{
              photoImg: { maxWidth: "100%", maxHeight: "100%" },
            }}
          />
        </div>
        <div className="new-product__button-container">
          {customer ? (
            <Button
              intent="success"
              text={price === 0 ? "Request a quote" : "Pay with Stripe"}
              icon="credit-card"
              style={{ margin: "8px 4px 0" }}
            />
          ) : (
            <>
              <Button
                text="Delete"
                intent="danger"
                onClick={(): void => setDeleteAlert(true)}
                style={{ margin: "8px 4px 0" }}
              />
              <Button
                text="Edit"
                intent="warning"
                onClick={(): void => setEditDialog(true)}
                style={{ margin: "8px 4px 0" }}
              />
            </>
          )}
        </div>
      </Card>
      <Alert
        isOpen={deleteAlertOpen}
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        icon="trash"
        intent="danger"
        onCancel={(): void => setDeleteAlert(false)}
        onConfirm={handleDeleteProduct}
      >
        <p>Are you sure you want to delete &quot;{title}&quot;?</p>
        <p>This cannot be undone.</p>
      </Alert>
      <ReactModal
        isOpen={editDialogOpen}
        onRequestClose={(): void => setEditDialog(false)}
        style={desktop ? desktopStyles : mobileStyles}
        contentLabel="Update Product"
        appElement={document.getElementById("app")}
      >
        <NewProduct
          update
          product={product}
          onCancel={(): void => setEditDialog(false)}
        />
      </ReactModal>
    </>
  );
};

export default Product;
