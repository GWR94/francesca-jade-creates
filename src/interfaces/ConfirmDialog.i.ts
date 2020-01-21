export interface ConfirmDialogProps {
  confirmDialogOpen: boolean;
  title: string;
  description: string;
  type: string;
  setPrice: boolean;
  productCost: string;
  shippingCost: string;
  isUploading: boolean;
  imagePreview: string;
  onProductCreate: () => void;
  closeModal: () => void;
  tags: string[];
}
