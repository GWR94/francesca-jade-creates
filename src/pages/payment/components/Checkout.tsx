import React, { useState } from "react";
import {
  TextField,
  Grid,
  Container,
  Typography,
  makeStyles,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import {
  Elements,
  CardElement,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import { connect, useSelector } from "react-redux";
import { ShoppingBasket, ExpandMore } from "@material-ui/icons";
import { Dispatch } from "redux";
import { loadStripe } from "@stripe/stripe-js";
import { BasketItemProps } from "../interfaces/Basket.i";
import { AppState } from "../../../store/store";
import { BasketState } from "../../../reducers/basket.reducer";
import * as actions from "../../../actions/basket.actions";
import { RemoveItemAction, ClearBasketAction } from "../../../interfaces/basket.redux.i";
import NonIdealState from "../../../common/containers/NonIdealState";
import PayButton from "./PayButton";
import { UserAttributeProps } from "../../accounts/interfaces/Accounts.i";
import { COLORS } from "../../../themes";
import { Variant } from "../../accounts/interfaces/Variants.i";

interface CheckoutProps {
  paymentProps?: {
    items: BasketItemProps[];
    cost: number;
  };
  items?: BasketItemProps[];
  cost?: number;
  userAttributes: UserAttributeProps;
}

interface CheckoutState {
  expanded: string | boolean;
}

interface CheckoutDispatchProps {
  clearBasket: () => ClearBasketAction;
  removeFromBasket: (id: string) => RemoveItemAction;
}

const Checkout: React.FC<CheckoutProps> = ({}) => {
  const [state, setState] = useState<CheckoutState>({
    expanded: false,
  });
  const { items } = useSelector(({ basket }: AppState) => basket);

  const multipleVariants = items.filter((item) => item.variants.length > 1);
  const { expanded } = state;

  const useStyles = makeStyles({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: "1rem",
      flexBasis: "33.33%",
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: "0.8rem",
      color: COLORS.LightGray,
    },
  });
  const classes = useStyles();
  const handleChange = (panel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean,
  ): void => {
    setState({ ...state, expanded: isExpanded ? panel : false });
  };

  return (
    <Grid container spacing={1}>
      <Grid item sm={7} xs={12}>
        <Typography variant="h5">Checkout</Typography>
        {multipleVariants.map((item) => (
          <FormControl>
            <InputLabel id="select-helper-label">Pick Variant</InputLabel>
            <Select labelId="select-helper-label">
              {item.variants.map((variant: Variant, i) => (
                <MenuItem value={i}>
                  {`${variant?.variantName ?? variant.dimensions} (${
                    variant.price.item
                  })`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
        {items.map((item: BasketItemProps, i) => {
          <Accordion
            expanded={expanded === `panel${i}`}
            onChange={handleChange(`panel${i}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls={`panel${i}-content`}
              id={`panel${i}-header`}
            >
              <Typography className={classes.heading}>{item.title}</Typography>
            </AccordionSummary>
          </Accordion>;
        })}
        {/* ) : (
        <NonIdealState
          title="Shopping Basket Empty"
          Icon={<ShoppingBasket />}
          subtext="Please add items to your shopping basket to view them"
        />
        )} */}
      </Grid>
      {/* <Grid item sm={5} xs={12}>
        <PayButton charge={{ items, cost }} userAttributes={userAttributes} />
      </Grid> */}
    </Grid>
  );
};

export default Checkout;
