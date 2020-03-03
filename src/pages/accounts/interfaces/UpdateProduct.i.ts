import { History } from "history";
import { ProductProps } from "../../../common/interfaces/Product.i";
import { ImageProps } from "./NewProduct.i";

export interface UpdateProps {
  match: {
    params: {
      id: string;
    };
  };
  history: History;
}

export interface UpdateState {
  isLoading: boolean;
  product: ProductProps;
  isAnimating: boolean;
  currentIndex: number;
  imageConfirmOpen: boolean;
  confirmDialogOpen: boolean;
  deleteAlertOpen: boolean;
  imagePreview: string;
  fileToUpload: ImageProps;
  isUploading: boolean;
  errors: {
    title: string;
    description: string;
  };
  percentUploaded: number;
  keyToDelete: string;
}
