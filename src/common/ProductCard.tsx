import React, { useState } from "react";
import { Card, Button, Alert, Tag } from "@blueprintjs/core";
import { API, graphqlOperation } from "aws-amplify";
import { S3Image } from "aws-amplify-react";
import { useHistory } from "react-router-dom";
import { ProductCardProps } from "./interfaces/Product.i";
import { deleteProduct } from "../graphql/mutations";
import { Toaster } from "../utils/index";

const Product: React.FC<ProductCardProps> = ({ product, admin }): JSX.Element => {
  const history = useHistory();
  const { id, image, title, price, shippingCost, type, tags } = product;
  const [deleteAlertOpen, setDeleteAlert] = useState(false);

  const handleDeleteProduct = async (): Promise<void> => {
    try {
      await API.graphql(graphqlOperation(deleteProduct, { input: { id } }));
      setDeleteAlert(false);
      Toaster.show({
        intent: "success",
        message: `${title} has been successfully removed.`,
      });
    } catch (err) {
      console.error(err);
      Toaster.show({
        intent: "danger",
        message: `${title} could not be removed.
        Please try again`,
      });
    }
  };

  const getIcon = (type): JSX.Element => {
    switch (type) {
      case "Cake":
        return <i className="fas fa-birthday-cake" style={{ color: "#fd4ef2" }} />;
      case "Card":
        return <i className="fas fa-pencil-alt" style={{ color: "#9370f6" }} />;
      case "Frame":
        return <i className="fas fa-palette" style={{ color: "#69abec" }} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Card elevation={2} interactive className="product__card">
        <div className="product__text-container">
          <p>
            <strong>{title}</strong> - {getIcon(type)}
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
        </div>
        <div className="product__image-container">
          <S3Image
            imgKey={image[0]?.key}
            theme={{
              photoImg: {
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            }}
          />
        </div>
        <div className="new-product__button-container">
          {!admin ? (
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
                onClick={(): void => history.push(`/account/${product.id}`)}
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
    </>
  );
};

export default Product;
