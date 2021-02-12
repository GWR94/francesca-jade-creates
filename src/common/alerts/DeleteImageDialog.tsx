import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  Button,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
} from "@material-ui/core";
import { S3Image } from "aws-amplify-react";
import { Skeleton } from "@material-ui/lab";
import { breakpoints } from "../../themes";

interface DeleteDialogProps {
  isOpen: boolean; // opens dialog when set to true
  closeDialog: () => void; // closes dialog
  keyToDelete: string; // key of image that is to be deleted
  handleDeleteImage: (key: string) => Promise<void>; // function to delete image from database
}

/**
 * Functional component to render a Dialog component which shows the user
 * the image that they have requested to delete, and actions to either delete
 * the chosen image, or cancel the operation.
 */
const DeleteImageDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  closeDialog,
  keyToDelete,
  handleDeleteImage,
}) => {
  // create state for loading
  const [isLoading, setLoading] = useState(true);

  // store the boolean value in a variable
  const fullscreen = useMediaQuery(breakpoints.down("sm"));

  return (
    <Dialog
      open={isOpen}
      onClose={closeDialog}
      fullScreen={fullscreen}
      style={{ maxWidth: 500, margin: "0 auto" }}
    >
      <DialogTitle style={{ padding: "12px", textAlign: "center" }}>
        Delete this image?
      </DialogTitle>
      <DialogContent>
        <DialogContentText style={{ textAlign: "center" }}>
          Are you sure you want to delete this image?
        </DialogContentText>
        <DialogContentText style={{ textAlign: "center" }}>
          Other images can be added at a later date.
        </DialogContentText>
        <S3Image
          imgKey={keyToDelete}
          theme={{
            photoImg: isLoading
              ? {
                  display: "none",
                }
              : {
                  width: "auto",
                  height: 400,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                },
          }}
          onLoad={(): void => setLoading(false)}
        />
        {/* if loading return a skeleton of the potential product */}
        {isLoading && (
          <Skeleton
            animation="wave"
            variant="rect"
            style={{
              width: "100%",
              height: 400,
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={closeDialog} style={{ margin: "0 5px" }}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={(): Promise<void> => {
            console.log(keyToDelete);
            handleDeleteImage(keyToDelete);
          }}
          style={{ margin: "0 5px" }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteImageDialog;
