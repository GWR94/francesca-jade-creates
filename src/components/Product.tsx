import React, { useState } from "react";
import { Card, Button, Alert } from "@blueprintjs/core";
import { API, graphqlOperation } from "aws-amplify";
import { S3Image } from "aws-amplify-react";
import { ProductProps } from "../interfaces/Product.i";
import { deleteProduct } from "../graphql/mutations";
import { Toaster } from "../utils/index";

const Product: React.FC<ProductProps> = ({
  id,
  image,
  title,
  description,
  price,
  shippingCost,
  type,
  tags,
}): JSX.Element => {
  const [deleteDialogOpen, setDeleteDialog] = useState(false);

  const handleDeleteProduct = async (): Promise<void> => {
    try {
      await API.graphql(graphqlOperation(deleteProduct, { input: { id } }));
      setDeleteDialog(false);
      Toaster.show({
        intent: "success",
        message: `${title} has been successfully removed.`,
      });
    } catch (err) {
      console.error("Error deleting product", err);
      Toaster.show({
        intent: "danger",
        message: `${title} could not be removed.
        Please try again`,
      });
    }
  };

  return (
    <>
      <Card>
        <p>{title}</p>
        <p>
          <em>{description}</em>
        </p>
        <S3Image
          imgKey={image.key}
          theme={{
            photoImg: { maxWidth: "100%", maxHeight: "100%" },
          }}
        />
        <Button
          text="Delete"
          intent="danger"
          onClick={(): void => setDeleteDialog(true)}
        />
      </Card>
      <Alert
        isOpen={deleteDialogOpen}
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        icon="trash"
        intent="danger"
        onCancel={(): void => setDeleteDialog(false)}
        onConfirm={(): Promise<void> => handleDeleteProduct()}
      >
        <p>Are you sure you want to delete &quot;{title}&quot;?</p>
        <p>This cannot be undone.</p>
      </Alert>
    </>
  );
};

export default Product;
