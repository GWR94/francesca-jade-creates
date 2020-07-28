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
