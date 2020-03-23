import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { useHistory } from "react-router-dom";
import { API, graphqlOperation } from "aws-amplify";
import { Button } from "@blueprintjs/core";
import { Toaster } from "../../utils";
import { ProductProps } from "../interfaces/Product.i";
import { UserAttributeProps } from "../../pages/accounts/interfaces/Accounts.i";
import { createOrder } from "../../graphql/mutations";

interface PayProps {
  product: ProductProps;
  userAttributes: UserAttributeProps;
}

interface AddressProps {
  city: string;
  country: string;
  address_line1: string;
  address_state: string;
  address_zip: string;
}

const PayButton: React.FC<PayProps> = ({ product, userAttributes }): JSX.Element => {
  const history = useHistory();

  const createShippingAddress = (source): AddressProps => ({
    city: source.address_city,
    country: source.address_country,
    address_line1: source.address_line1,
    address_state: source.address_state,
    address_zip: source.address_zip,
  });

  const handleCharge = async (token): Promise<void> => {
    try {
      const res = await API.post("orders", "/charge", {
        body: {
          token,
          charge: {
            currency: "GBP",
            amount: (product.price + product.shippingCost) * 100,
            description: product.description,
          },
          email: {
            customerEmail: userAttributes.email,
            ownerEmail: "contact@francescajadecreates.co.uk",
          },
          product,
        },
      });
      console.log({ res });
      if (res.charge.status === "succeeded") {
        const shippingAddress = createShippingAddress(res.charge.source);
        const input = {
          orderUserId: userAttributes.sub,
          orderProductId: product.id,
          shippingAddress,
          createdAt: new Date(),
        };
        const order = await API.graphql(graphqlOperation(createOrder, { input }));
        console.log(order);
        Toaster.show({
          intent: "success",
          message: res.message,
          timeout: 3000,
        });
        setTimeout(() => {
          history.push("/");
          Toaster.show({
            intent: "primary",
            message: "Check your verified email address for order confirmation",
            icon: "info-sign",
          });
        }, 3000);
      }
    } catch (err) {
      console.error("error", err);
    }
  };

  console.log(process.env.STRIPE_SECRET_KEY);

  return (
    <StripeCheckout
      token={handleCharge}
      email={userAttributes.email}
      name={product.title}
      amount={(product.price + product.shippingCost) * 100}
      description={product.description}
      billingAddress
      shippingAddress
      currency="GBP"
      stripeKey={process.env.STRIPE_SECRET_KEY}
      locale="en"
    >
      <Button
        text="Pay with Stripe"
        intent="success"
        large
        icon={<i className="fas fa-credit-card" />}
      />
    </StripeCheckout>
  );
};

export default PayButton;
