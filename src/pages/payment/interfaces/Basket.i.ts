import { Variant } from "../../accounts/interfaces/Variants.i";
import { S3ImageProps } from "../../accounts/interfaces/Product.i";

export interface BasketItemProps {
  id: string;
  title: string;
  description: string;
  image: S3ImageProps;
  type: string;
  tagline: string;
  variants: Variant[];
  customOptions: string[];
}

export interface CheckoutProductProps {
  id: string;
  title: string;
  tagline: string;
  image: S3ImageProps;
  variant: Variant | null;
  price: number;
  shippingCost: number;
  customOptions?: CustomOptionArrayType;
}

export interface CustomOptionsState {
  currentTextValue: string;
  currentArrayValue: string[];
  currentImagesArray: S3ImageProps[];
  currentMultipleChoice: string;
  uploadedImage: string | null;
  currentImageFile: S3ImageProps | null;
  imageCount: number;
  expanded: string | false;
  imageCompleted: boolean;
  confirmDialogOpen: boolean;
  uploadedImageArray: S3ImageProps[];
  currentNotesValue: string;
  isCompleted: boolean;
}

export type CustomOptionArrayType = {
  [key: string]: string | S3ImageProps[] | string[];
}[];

export interface CustomOptionsProps {
  currentVariant: Variant | null;
  setCustomOptions: (options: CustomOptionArrayType) => void;
  customOptions: CustomOptionArrayType;
  colorScheme: string[];
}
