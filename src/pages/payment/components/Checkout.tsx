import React, { useState } from "react";
import {
  Grid,
  Typography,
  makeStyles,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import { useSelector } from "react-redux";
import { ExpandMore } from "@material-ui/icons";
import { BasketItemProps } from "../interfaces/Basket.i";
import { AppState } from "../../../store/store";
import { Variant } from "../../accounts/interfaces/Variants.i";
import styles from "../styles/checkout.style";

const Checkout: React.FC = () => {
  const [expanded, setExpanded] = useState<string | boolean>(false);
  const { items } = useSelector(({ basket }: AppState) => basket);
  const multipleVariants = items.filter((item) => item.variants.length > 1);

  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const handleChange = (panel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean,
  ): void => {
    setExpanded(isExpanded ? panel : false);
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
            TransitionProps={{ unmountOnExit: true }}
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
