import { ProductProps, S3ImageProps } from "./Product.i";

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  type: "Cake" | "Creates";
  tagline?: string;
  setPrice: boolean;
  productCost: string;
  shippingCost: string;
  isUploading: boolean;
  imagePreview?: string;
  onProductCreate: () => void;
  closeModal: () => void;
  tags: string[];
  image: S3ImageProps[];
  product?: ProductProps;
  percentUploaded: number;
  update: boolean;
}
