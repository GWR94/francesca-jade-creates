import { UserAttributeProps } from "./Accounts.i";
import { S3ImageProps } from "./Product.i";
import { Variant } from "../../products/interfaces/Variants.i";

export interface GraphQlProduct {
  id: string;
  title: string;
  tagline: string;
  image: S3ImageProps;
  variant: Variant;
  customOptions: string[];
}

export interface OrderProps {
  id: string;
  createdAt: string;
  paymentStatus: string;
  products: GraphQlProduct[];
  shippingAddress: { [key: string]: string };
  stripePaymentIntent: string;
  user: UserAttributeProps;
  orderProcessed: boolean;
  shipped: boolean;
}
