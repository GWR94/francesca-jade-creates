export interface NewProductState {
  title: string;
  description: string;
  type: string;
  setPrice: boolean;
  productCost: string;
  shippingCost: string;
  image: Image;
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
}

interface Image {
  file: File;
  name: string;
  size: number;
  type: string;
}

export interface UploadedFile {
  key: string;
}
