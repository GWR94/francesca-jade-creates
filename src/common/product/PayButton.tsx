import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { ProductProps } from "../interfaces/Product.i";
import { UserAttributeProps } from "../../pages/accounts/interfaces/Accounts.i";

interface Props {
  product: ProductProps;
  userAttributes: UserAttributeProps;
}

const PayButton = ({ product, userAttributes }): JSX.Element => {
  console.log(userAttributes);
  return <StripeCheckout email={userAttributes.email} name={product.title} />;
};

export default PayButton;
