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
  dialogOpen: boolean; // opens dialog when set to true
  closeDialog: () => void; // closes dialog
  keyToDelete: string; // key of image that is to be deleted
  handleDeleteImage: () => void; // function to delete image from database
}

// theme to
const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});

const DeleteImageDialog: React.FC<DeleteDialogProps> = ({
  dialogOpen,
  closeDialog,
  keyToDelete,
  handleDeleteImage,
}) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Dialog open={dialogOpen} onClose={closeDialog}>
      <DialogTitle style={{ padding: "12px", textAlign: "center" }}>
        Delete this image?
      </DialogTitle>
      <div className="update__alert-container">
        <p>
          Are you sure you want to delete this image? Other images can be added at a later
          date.
        </p>
        {isLoading && <CircularProgress style={{ padding: 100 }} color="inherit" />}
        <S3Image
          imgKey={keyToDelete}
          theme={{
            photoImg: isLoading
              ? { display: "none" }
              : { maxWidth: "100%", marginBottom: "20px" },
          }}
          onLoad={(): void => setLoading(false)}
        />
        <ThemeProvider theme={theme}>
          <div className="dialog__button-container">
            <Button
              color="secondary"
              variant="contained"
              onClick={(): void => {
                closeDialog();
                setLoading(true);
              }}
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
