import React, { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import { useHistory } from "react-router-dom";
import { API, graphqlOperation } from "aws-amplify";
import { Button } from "@material-ui/core";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import Notifier, { openSnackbar } from "../../../utils/Notifier";
import { ProductProps } from "../../accounts/interfaces/Product.i";
import { UserAttributeProps } from "../../accounts/interfaces/Accounts.i";
import { createOrder } from "../../../graphql/mutations";
import Loading from "../../../common/Loading";
import Stripe from "@stripe/stripe-js";

interface PayProps {
  charge: {
    items: ProductProps[];
    cost: number;
  };
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

const PayButton: React.FC<PayProps> = ({ charge, userAttributes }): JSX.Element => {
  const history = useHistory();

  const elements = useElements();
  const [isLoading, setLoading] = useState(true);
  let stripePromise = null;
  useEffect(() => {
    console.log(process.env.STRIPE_PUBLIC_KEY);
    stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);
    setLoading(false);
  }, []);

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
  const { STRIPE_PUBLIC_KEY } = process.env;
  if (STRIPE_PUBLIC_KEY)
    return isLoading ? (
      <Loading />
    ) : (
      <Elements stripe={stripePromise !== null ? stripePromise : null}>
        <CardElement />
      </Elements>
    );
};

export default PayButton;
