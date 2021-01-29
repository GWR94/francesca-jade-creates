import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from "@material-ui/core";
import { API, graphqlOperation } from "aws-amplify";
import { S3Image } from "aws-amplify-react";
import React from "react";
import { deleteProduct } from "../../graphql/mutations";
import { ProductProps } from "../../pages/accounts/interfaces/Product.i";
import { FONTS, INTENT } from "../../themes";
import { openSnackbar } from "../../utils/Notifier";

interface DeleteProductProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductProps;
}

const DeleteProductAlert: React.FC<DeleteProductProps> = ({
  isOpen,
  onClose,
  product,
}): JSX.Element => {
  const { title, images, id } = product;

  /**
   * Function to delete the current product from the database, using the deleteProduct
   * graphQL mutation.
   */
  const handleDeleteProduct = async (): Promise<void> => {
    try {
      // use the id of the current product as the input for deleteProduct
      await API.graphql(
        graphqlOperation(deleteProduct, {
          input: {
            id,
          },
        }),
      );
      // close the confirm delete dialog
      onClose();
      // notify the user of success using a success snackbar with a relevant title.
      openSnackbar({
        severity: INTENT.Success,
        message: `${title} has been successfully removed.`,
      });
    } catch (err) {
      console.error(err);
      // if there are any errors, notify the user with a danger snackbar.
      openSnackbar({
        severity: INTENT.Danger,
        message: `${title} could not be removed.
        Please try again`,
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      style={{
        fontFamily: `${FONTS.Title}, sans-serif`,
        padding: "20px",
        width: 400,
        margin: "0 auto",
      }}
    >
      <DialogTitle>Delete &quot;{title}&quot;?</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Are you sure you want to delete &quot;
          {title}
          &quot;?
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          This cannot be undone.
        </Typography>
        <S3Image
          imgKey={images.collection[images.cover].key}
          theme={{
            photoImg: {
              width: 300,
              margin: "0 auto",
              display: "block",
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Cancel
        </Button>
        <Button color="secondary" onClick={handleDeleteProduct}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProductAlert;
