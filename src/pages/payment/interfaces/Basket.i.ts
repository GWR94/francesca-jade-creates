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
}

export interface CheckoutProductProps {
  id: string;
  title: string;
  tagline: string;
  image: S3ImageProps;
  variant: Variant;
  price: number;
  shippingCost: number;
  customOptions: CustomOptionArrayType;
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
}

export type CustomOptionArrayType = {
  [key: string]: string | S3ImageProps[] | string[] | undefined;
}[];

export interface CustomOptionsProps {
  setCustomOptions: (customOptions: CustomOptionArrayType) => void;
  currentVariant: Variant;
  customOptions: CustomOptionArrayType;
}
