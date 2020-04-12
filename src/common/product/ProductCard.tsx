import React, { useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import {
  Card,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import { S3Image } from "aws-amplify-react";
import { ProductCardProps } from "../interfaces/Product.i";
import { deleteProduct } from "../../graphql/mutations";
import { Toaster } from "../../utils/index";
import TagsInput from "../TagsInput";

const Product: React.FC<ProductCardProps> = ({
  product,
  admin = false,
  history,
}): JSX.Element => {
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
        return (
          <i
            className="fas fa-birthday-cake product__icon"
            style={{ color: "#fd4ef2" }}
            tabIndex={0}
            role="button"
            onClick={(e): void => {
              e.stopPropagation();
              history.push("/cakes");
            }}
          />
        );
      case "Creates":
        return (
          <i
            className="fas fa-pencil-alt product__icon"
            style={{ color: "#9370f6" }}
            tabIndex={0}
            role="button"
            onClick={(e): void => {
              e.stopPropagation();
              history.push("/creates");
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card
        elevation={2}
        style={{ padding: "20px" }}
        className="product__card animate fadeIn"
        onClick={(): void =>
          history.push(`/${type === "Cake" ? "cakes" : "creates"}/${id}`)
        }
      >
        {getIcon(type)}
        <div className="product__text-container">
          <div className="product__title">
            <strong>{title}</strong>
          </div>
          <p className="product__price">
            {price > 0
              ? `£${price.toFixed(2)} + £${shippingCost.toFixed(2)} postage`
              : "Customer requests quote"}
          </p>
          {tags && <TagsInput type={type} tags={tags} />}
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
        {admin && (
          <div className="new-product__button-container">
            <Button
              onClick={(e): void => {
                e.stopPropagation();
                setDeleteAlert(true);
              }}
              style={{ margin: "8px 4px 0", background: "#fd4ef2", color: "#fff" }}
            >
              Delete
            </Button>
            <Button
              onClick={(e): void => {
                e.stopPropagation();
                history.push(`/account/${product.id}`);
              }}
              style={{ margin: "8px 4px 0", background: "#ff80f7", color: "#fff" }}
            >
              Edit
            </Button>
          </div>
        )}
      </Card>
      <Dialog open={deleteAlertOpen} onClose={(): void => setDeleteAlert(false)}>
        <DialogTitle>Delete &quot;{title}&quot;?</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete &quot;{title}&quot;?</p>
          <p>This cannot be undone.</p>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={(): void => setDeleteAlert(false)}>
            Cancel
          </Button>
          <Button color="secondary" onClick={handleDeleteProduct}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Product;
