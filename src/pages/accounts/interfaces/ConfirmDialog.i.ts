import { ProductProps } from "./Product.i";

export interface ConfirmDialogProps {
  isOpen: boolean;
  isUploading: boolean;
  imagePreview?: string;
  onProductCreate: () => void;
  closeModal: () => void;
  product: ProductProps;
  percentUploaded: number;
  update: boolean;
}
