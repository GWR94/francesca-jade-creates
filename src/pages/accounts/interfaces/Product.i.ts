import { Variant } from "./Variants.i";

export interface ProductCardProps {
  product: ProductProps;
  admin?: boolean;
}

export interface ProductProps {
  id: string;
  title: string;
  description: string;
  tagline: string;
  type: "Cake" | "Creates";
  images: {
    cover: number;
    collection: S3ImageProps[];
  };
  customOptions: string[];
  tags: string[];
  setPrice: boolean;
  variants: Variant[];
}

export interface CustomOptions {
  creates: CreatesFeature | null;
  cake: CakeFeature[] | null;
}

export interface CreatesFeature {
  images: number;
  text: number;
  colorScheme: boolean;
}

export interface CakeFeature {
  name: string;
  description: string;
  priceChange: number;
}

export interface S3ImageProps {
  bucket: string;
  region: string;
  key: string;
}
