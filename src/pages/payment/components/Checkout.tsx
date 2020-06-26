import React from "react";
import { TextField, Grid, Container, Typography } from "@material-ui/core";
import {
  Elements,
  CardElement,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { loadStripe } from "@stripe/stripe-js";
import { BasketItemProps } from "../interfaces/Basket.i";
import { AppState } from "../../../store/store";
import { BasketState } from "../../../reducers/basket.reducer";
import * as actions from "../../../actions/basket.actions";
import { RemoveItemAction, ClearBasketAction } from "../../../interfaces/basket.redux.i";
import NonIdealState from "../../../common/containers/NonIdealState";
import { ShoppingBasket } from "@material-ui/icons";
import PayButton from "./PayButton";

interface Props {
  paymentProps?: {
    items: BasketItemProps[];
    cost: number;
  };
  items?: BasketItemProps[];
  cost?: number;
  userAttributes: UserAttributeProps;
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
  removeFromBasket: (id: string) => RemoveItemAction;
}

class Checkout extends React.Component<Props, State> {
  public readonly state = {
    items: [],
    cost: 0,
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
      const { items = [], cost = 0 } = this.props;
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
    const { userAttributes } = this.props;
    return (
      <Grid container spacing={1}>
        <Grid item sm={7} xs={12}>
          <Typography variant="h5">Your Basket ({items?.length ?? 0})</Typography>
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
        <Grid item sm={5} xs={12}>
          <PayButton charge={{ items, cost }} userAttributes={userAttributes} />
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = ({ basket }: AppState): BasketState => ({
  items: basket.items,
  cost: basket.cost,
});

const mapDispatchToProps = (dispatch: Dispatch): CheckoutDispatchProps => ({
  removeFromBasket: (id): RemoveItemAction => dispatch(actions.removeFromBasket(id)),
  clearBasket: (): ClearBasketAction => dispatch(actions.clearBasket()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
