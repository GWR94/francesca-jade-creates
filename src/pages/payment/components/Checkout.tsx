import React from "react";
import { Callout, InputGroup, FormGroup, Label } from "@blueprintjs/core";
import {
  Elements,
  CardElement,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { BasketItemProps } from "../interfaces/Basket.i";
import { AppState } from "../../../store/store";
import { BasketState } from "../../../reducers/basket.reducer";
import * as actions from "../../../actions/basket.actions";
import { RemoveItemAction, ClearBasketAction } from "../../../interfaces/basket.redux.i";
import { connect } from "react-redux";
import { Col, Row } from "reactstrap";
import { Container } from "@material-ui/core";

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
      <Container>
        <Callout
          className="basket__info"
          intent="warning"
          title="COVID-19 Update"
          icon="info-sign"
        >
          <p className="basket__info-text">
            Due to the COVID-19 pandemic there may be minor delays in production of
            Francesca Jade Creates products, however the products are still going to be
            processed and delivered as soon as possible.
          </p>
        </Callout>
        <div className="checkout__card-payment-container">
          <h3>SHIPPING & PAYMENT INFORMATION</h3>
          <Label>Name</Label>
          <InputGroup
            value={name}
            onChange={(e): void => this.setState({ name: e.target.value })}
          />
          <FormGroup label="Email" inline>
            <InputGroup
              value={email}
              onChange={(e): void => this.setState({ email: e.target.value })}
            />
          </FormGroup>
          <FormGroup label="Address Line 1" inline>
            <InputGroup
              value={addressLine1}
              onChange={(e): void => this.setState({ addressLine1: e.target.value })}
            />
          </FormGroup>
          <FormGroup label="Address Line 2" labelInfo="(optional)" inline>
            <InputGroup
              value={addressLine2}
              onChange={(e): void => this.setState({ addressLine2: e.target.value })}
            />
          </FormGroup>
          <FormGroup label="City" inline>
            <InputGroup
              value={city}
              onChange={(e): void => this.setState({ city: e.target.value })}
            />
          </FormGroup>
          <Row>
            <Col sm={8}>
              <FormGroup label="County" inline>
                <InputGroup
                  value={county}
                  onChange={(e): void => this.setState({ county: e.target.value })}
                />
              </FormGroup>
            </Col>
            <Col sm={4}>
              <FormGroup label="PostCode" inline>
                <InputGroup
                  value={postCode}
                  onChange={(e): void => this.setState({ postCode: e.target.value })}
                />
              </FormGroup>
            </Col>
          </Row>
          <h3>PAYMENT INFORMATION</h3>
          <Elements stripe={stripePromise}>
            <CardElement />
          </Elements>
        </div>
      </Container>
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
