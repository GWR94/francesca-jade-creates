import { History } from "history";

export interface ProductCardProps {
  product: ProductProps;
  admin?: boolean;
  history: History;
}

export interface ProductProps {
  id: string;
  title: string;
  description: string;
  image: S3ImageProps[];
  price: number;
  shippingCost: number;
  type: string;
  tags: string[];
  setPrice: boolean;
}

export interface S3ImageProps {
  bucket: string;
  region: string;
  key: string;
}
