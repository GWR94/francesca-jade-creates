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
  tagline: string;
  image: S3ImageProps[];
  price: number;
  shippingCost: number;
  type: "Cake" | "Creates";
  tags: string[];
  setPrice: boolean;
  customisedOptions: {
    images: number;
    text: number;
    colorScheme: boolean;
  };
}

export interface S3ImageProps {
  bucket: string;
  region: string;
  key: string;
}
