import { S3ImageProps } from "../../accounts/interfaces/Product.i";
import { Feature } from "../../products/interfaces/Variants.i";
import { CustomOptionArrayType } from "./Basket.i";

export interface RenderInputState {
  currentInputValue: unknown;
  confirmDialogOpen: boolean;
  currentImageFile: S3ImageProps | null;
  uploadedImage: string | null;
  imageCompleted: boolean;
  maxNumber: number;
  minNumber: number;
}

export interface RenderInputProps {
  feature: Feature;
  i: number;
  setCustomOptions: (options: CustomOptionArrayType) => void;
  customOptions: CustomOptionArrayType;
  setExpanded: (panel: string) => void;
  featuresLength: number;
  imageCompleted: boolean;
  setImageCompleted: (isCompleted: boolean) => void;
}
