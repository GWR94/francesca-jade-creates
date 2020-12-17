import { ProductType } from "./Product.i";
import { Variant } from "./Variants.i";

export interface ViewVariantsProps {
  // array of
  variants: Variant[];
  customOptions: string[];
  type: ProductType;
}

export interface ViewVariantsState {
  currentVariant: Variant | null;
  variantIdx: string;
  userShouldPickVariant: boolean;
}
