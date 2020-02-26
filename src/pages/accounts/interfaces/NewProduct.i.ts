import { ProductProps, S3ImageProps } from "../../../common/interfaces/Product.i";

export interface NewProductState {
  title: {
    value: string;
    error: string;
  };
  description: {
    value: string;
    error: string;
  };
  type: string;
  setPrice: boolean;
  productCost: string;
  shippingCost: string;
  image: {
    value: ImageProps | S3ImageProps;
    error: string;
    preview: string;
  };
  isUploading: boolean;
  confirmDialogOpen: boolean;
  percentUploaded: number;
  tags: string[];
}

export interface NewProductProps {
  onCancel: () => void;
  update?: boolean;
  product?: ProductProps;
  admin: boolean;
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
