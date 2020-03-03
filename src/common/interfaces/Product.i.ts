export interface ProductProps {
  id: string;
  title: string;
  description: string;
  image: S3ImageProps[];
  price: number;
  shippingCost: number;
  type: string;
  tags: string[];
  owner: string;
  customer?: boolean;
  admin: boolean;
  setPrice?: boolean;
}

export interface S3ImageProps {
  bucket: string;
  region: string;
  key: string;
}
