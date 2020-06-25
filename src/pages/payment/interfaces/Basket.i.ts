import { S3ImageProps } from "../../accounts/interfaces/Product.i";

export interface BasketItemProps {
  id: string;
  title: string;
  description: string;
  price: number;
  shippingCost: number;
  image: S3ImageProps;
  type: string;
  tagline: string;
}
