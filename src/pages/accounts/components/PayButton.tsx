import React, { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import { useHistory } from "react-router-dom";
import { API, graphqlOperation } from "aws-amplify";
import { Button } from "@material-ui/core";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Notifier, { openSnackbar } from "../../../utils/Notifier";
import { ProductProps } from "../interfaces/Product.i";
import { UserAttributeProps } from "../interfaces/Accounts.i";
import { createOrder } from "../../../graphql/mutations";
import Loading from "../../../common/Loading";
import Stripe from "@stripe/stripe-js";

interface PayProps {
  product: ProductProps;
  userAttributes: UserAttributeProps;
}

interface AddressProps {
  city: string;
  country: string;
  address_line1: string;
  address_line2?: string;
  address_county: string;
  address_postcode: string;
}

const PayButton: React.FC<PayProps> = ({ product, userAttributes }): JSX.Element => {
  const history = useHistory();
  const stripe = useStripe();

  const elements = useElements();
  const [isLoading, setLoading] = useState(true);

  const handleSubmit = async (e): Promise<void> => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
  };

  const createShippingAddress = (source): AddressProps => ({
    city: source.address_city,
    country: source.address_country,
    address_line1: source.address_line1,
    address_line2: source.address_line2 || undefined,
    address_county: source.address_state,
    address_postcode: source.address_zip,
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
        openSnackbar({
          severity: "success",
          message: res.message,
        });
        setTimeout(() => {
          history.push("/");
          openSnackbar({
            severity: "info",
            message: "Check your verified email address for order confirmation",
          });
        }, 3000);
      }
    } catch (err) {
      console.error("error", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default PayButton;
