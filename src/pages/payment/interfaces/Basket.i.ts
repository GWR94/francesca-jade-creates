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
  expanded: string | false;
  currentNotesValue: string;
  isCompleted: boolean;
  currentColorScheme: string;
  imageCompleted: boolean;
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
