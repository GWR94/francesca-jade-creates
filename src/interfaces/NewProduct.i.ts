import { ProductProps, S3ImageProps } from "./Product.i";

export interface NewProductState {
  title: string;
  description: string;
  type: string;
  setPrice: boolean;
  productCost: string;
  shippingCost: string;
  image: ImageProps | S3ImageProps;
  imagePreview: string;
  isUploading: boolean;
  titleError: string;
  descriptionError: string;
  imageError: string;
  confirmDialogOpen: boolean;
  percentUploaded: number;
  tags: string[];
}

export interface NewProductProps {
  onCancel: () => void;
  update?: boolean;
  product?: ProductProps;
}

export interface ImageProps {
  file: File;
  name: string;
  size: number;
  type: string;
}

export interface UploadedFile {
  key: string;
}
