import React, { useState } from "react";
import { Card, Button, Alert, Tag } from "@blueprintjs/core";
import { API, graphqlOperation } from "aws-amplify";
import { S3Image } from "aws-amplify-react";
import { ProductCardProps } from "./interfaces/Product.i";
import { deleteProduct } from "../graphql/mutations";
import { Toaster } from "../utils/index";

const Product: React.FC<ProductCardProps> = ({
  product,
  admin,
  history,
}): JSX.Element => {
  console.log(product);
  const { id, image, title, description, price, shippingCost, type, tags } = product;
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
            imgKey={image[0]?.key}
            theme={{
              photoImg: { maxWidth: "100%", maxHeight: "100%" },
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
                onClick={(): void => history.push(`/accounts/${product.id}`)}
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
