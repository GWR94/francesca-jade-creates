import { S3ImageProps } from "../../accounts/interfaces/Product.i";
import { Feature } from "../../accounts/interfaces/Variants.i";
import { CustomOptionArrayType } from "./Basket.i";

export interface RenderInputState {
  currentInputValue: unknown;
  confirmDialogOpen: boolean;
  currentImageFile: S3ImageProps | null;
  imageCompleted: boolean;
  uploadedImage: string | null;
}

export interface RenderInputProps {
  feature: Feature;
  i: number;
  setCustomOptions: (options: CustomOptionArrayType) => void;
  customOptions: CustomOptionArrayType;
  setExpanded: (panel: string) => void;
  updatedInputValue: unknown;
  featuresLength: number;
}
