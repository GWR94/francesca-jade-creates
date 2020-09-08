import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { useHistory } from "react-router-dom";
import { API, graphqlOperation } from "aws-amplify";
import { Button } from "@material-ui/core";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { createOrder } from "../../../graphql/mutations";
import { openSnackbar } from "../../../utils/Notifier";
import { UserAttributeProps } from "../../accounts/interfaces/Accounts.i";
import { ProductProps } from "../../accounts/interfaces/Product.i";
import { INTENT } from "../../../themes";
import { AppState } from "../../../store/store";

interface PayProps {
  userAttributes: UserAttributeProps;
}

interface AddressProps {
  city: string;
  country: string;
  address_line1: string;
  address_state: string;
  address_zip: string;
}

const PayButton: React.FC<PayProps> = ({ userAttributes }): JSX.Element => {
  const history = useHistory();

  const createShippingAddress = (source): AddressProps => ({
    city: source.address_city,
    country: source.address_country,
    address_line1: source.address_line1,
    address_state: source.address_state,
    address_zip: source.address_zip,
  });

  const { products, cost } = useSelector(({ basket }: AppState) => basket.checkout);

  const handleCharge = async (token): Promise<void> => {
    try {
      const res = await API.post("orders", "/charge", {
        body: {
          token,
          charge: {
            currency: "GBP",
            amount: cost * 100,
            description: "Purchase your Francesca Jade Creates items",
          },
          email: {
            customerEmail: userAttributes?.email,
            ownerEmail: "contact@francescajadecreates.co.uk",
          },
          products,
        },
      });
      console.log({ res });
      if (res.charge.status === "succeeded") {
        const shippingAddress = createShippingAddress(res.charge.source);
        const input = {
          orderUserId: userAttributes.sub,
          orderProductId: uuidv4(),
          shippingAddress,
          createdAt: new Date(),
        };
        const order = await API.graphql(graphqlOperation(createOrder, { input }));
        console.log(order);
        openSnackbar({
          severity: INTENT.Success,
          message: res.message,
        });
        setTimeout(() => {
          history.push("/");
          openSnackbar({
            severity: INTENT.Info,
            message: "Check your verified email address for order confirmation",
          });
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <StripeCheckout
      token={handleCharge}
      email={userAttributes?.email}
      name="Payment"
      amount={cost * 100}
      description="Purchase your Francesca Jade Creates products"
      billingAddress
      shippingAddress
      currency="GBP"
      stripeKey={process.env.STRIPE_PUBLIC_KEY}
      locale="en"
    >
      <Button>
        <i className="fas fa-credit-card" /> Pay with Stripe
      </Button>
    </StripeCheckout>
  );
};

export default PayButton;
