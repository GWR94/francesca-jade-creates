import React from "react";
import { TextField, Grid, Container, Typography } from "@material-ui/core";
import {
  Elements,
  CardElement,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { connect } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { BasketItemProps } from "../interfaces/Basket.i";
import { AppState } from "../../../store/store";
import { BasketState } from "../../../reducers/basket.reducer";
import * as actions from "../../../actions/basket.actions";
import { RemoveItemAction, ClearBasketAction } from "../../../interfaces/basket.redux.i";
import NonIdealState from "../../../common/containers/NonIdealState";
import { ShoppingBasket } from "@material-ui/icons";

interface Props {
  paymentProps?: {
    items: BasketItemProps[];
    cost: number;
  };
}

interface State {
  items: BasketItemProps[];
  cost: number;
  name: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  county: string;
  postCode: string;
}

interface CheckoutDispatchProps {
  clearBasket: () => ClearBasketAction;
  removeFromBasket: (id) => RemoveItemAction;
}

class Checkout extends React.Component<Props, State> {
  public readonly state = {
    items: null,
    cost: null,
    name: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    county: "",
    postCode: "",
  };

  public componentDidMount(): void {
    const { paymentProps } = this.props;
    if (!paymentProps) {
      const { items, cost } = this.props;
      this.setState({ items, cost });
    } else {
      const { items, cost } = paymentProps;
      this.setState({ items, cost });
    }
  }

  public render(): JSX.Element {
    const {
      name,
      email,
      addressLine1,
      addressLine2,
      city,
      county,
      postCode,
      items,
      cost,
    } = this.state;
    const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);
    return (
      <Grid container spacing={1}>
        <Grid item sm={7} xs={12}>
          <Typography variant="h5">Your Basket ({items.length})</Typography>
          {items.length ? (
            items.map((item): void => {
              console.log(item);
            })
          ) : (
            <NonIdealState
              title="Shopping Basket Empty"
              Icon={<ShoppingBasket />}
              subtext="Please add items to your shopping basket to view them"
            />
          )}
        </Grid>
        <Grid item sm={5} xs={12}></Grid>
      </Grid>
    );
  }
}

const mapStateToProps = ({ basket }: AppState): BasketState => ({
  items: basket.items,
  cost: basket.cost,
});

const mapDispatchToProps = (dispatch): CheckoutDispatchProps => ({
  removeFromBasket: (id): RemoveItemAction => dispatch(actions.removeFromBasket(id)),
  clearBasket: (): ClearBasketAction => dispatch(actions.clearBasket()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
