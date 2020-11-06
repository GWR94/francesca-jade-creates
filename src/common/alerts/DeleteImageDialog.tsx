import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  ThemeProvider,
  Button,
  createMuiTheme,
  CircularProgress,
} from "@material-ui/core";
import { S3Image } from "aws-amplify-react";
import { green } from "@material-ui/core/colors";

interface DeleteDialogProps {
  isOpen: boolean; // opens dialog when set to true
  closeDialog: () => void; // closes dialog
  keyToDelete: string; // key of image that is to be deleted
  handleDeleteImage: () => void; // function to delete image from database
}

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});

const DeleteImageDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  closeDialog,
  keyToDelete,
  handleDeleteImage,
}) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Dialog open={isOpen} onClose={() => closeDialog}>
      <DialogTitle style={{ padding: "12px", textAlign: "center" }}>
        Delete this image?
      </DialogTitle>
      <div className="update__alert-container">
        <p>
          Are you sure you want to delete this image? Other images can be added at a later
          date.
        </p>
        <S3Image
          imgKey={keyToDelete}
          theme={{
            photoImg: { maxWidth: "100%", marginBottom: "20px" },
          }}
        />
        <ThemeProvider theme={theme}>
          <div className="dialog__button-container">
            <Button
              color="secondary"
              variant="contained"
              onClick={closeDialog}
              style={{ margin: "0 5px" }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={handleDeleteImage}
              style={{ margin: "0 5px", color: "#fff" }}
            >
              Confirm
            </Button>
          </div>
        </ThemeProvider>
      </div>
    </Dialog>
  );
};

export default DeleteImageDialog;
