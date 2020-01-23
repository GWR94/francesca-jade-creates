export interface ProductProps {
  id: string;
  title: string;
  description: string;
  image: {
    bucket: string;
    region: string;
    key: string;
  };
  price: number;
  shippingCost: number;
  type: string;
  tags: string[];
  owner: string;
}
