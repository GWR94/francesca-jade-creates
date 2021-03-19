import {
  Accordion,
  AccordionSummary,
  Grid,
  Typography,
  Chip,
  AccordionDetails,
  Button,
  makeStyles,
  useMediaQuery,
  Divider,
} from "@material-ui/core";
import { ExpandMoreRounded } from "@material-ui/icons";
import dayjs from "dayjs";
import React, { ChangeEvent, useState } from "react";
import { GraphQlProduct, OrderProps } from "../interfaces/Orders.i";
import styles from "../styles/orders.style";

import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import CustomOptionsDialog from "./CustomOptionsDialog";

interface OrderItemProps {
  order: OrderProps;
  i: number;
  expanded: string | false;
  handlePanelChange: (
    panel: string,
  ) => (event: ChangeEvent<{}>, expanded: boolean) => void;
}

interface OrderItemState {
  currentProduct: GraphQlProduct | null;
  dialogOpen: boolean;
  showID: boolean;
}

const OrderItem = ({
  order,
  i,
  expanded,
  handlePanelChange,
}: OrderItemProps): JSX.Element => {
  const [state, setState] = useState<OrderItemState>({
    currentProduct: null,
    dialogOpen: false,
    showID: false,
  });

  const desktop = useMediaQuery("(min-width: 600px)");

  /**
   * Function which returns the full price of all the products in the order.
   * @param products - Array of products to retrieve the accumulative price from
   */
  const getOrderPrice = (products: GraphQlProduct[]): string => {
    let price = 0;
    products.map((product) => {
      price += product.variant.price.item + product.variant.price.postage;
    });
    return `£${price.toFixed(2)}`;
  };

  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const { currentProduct, dialogOpen, showID } = state;
  return (
    <>
      <Accordion
        expanded={expanded === `panel${i}`}
        key={i}
        onChange={handlePanelChange(`panel${i}`)}
        TransitionProps={{
          unmountOnExit: true,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreRounded />}
          aria-controls={`panel${i}-content`}
          id={`panel${i}-header`}
          style={{
            alignItems: "center",
          }}
        >
          <Grid
            container
            style={{
              marginRight: -30,
            }}
          >
            <Grid item xs={6}>
              <Typography className={classes.heading}>
                {dayjs(order.createdAt).format(desktop ? "llll" : "LL")}
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div className={classes.secondaryHeading}>
                <Typography className={classes.heading}>
                  {getOrderPrice(order.products)}
                </Typography>
                {order.paymentStatus === "paid" ? (
                  <Chip
                    className={classes.paidTag}
                    size="small"
                    color="primary"
                    label="Paid"
                    variant="outlined"
                    classes={{
                      label: classes.paidLabel,
                    }}
                  />
                ) : (
                  <Chip
                    className={classes.unpaidTag}
                    size="small"
                    color="secondary"
                    label="Unpaid"
                  />
                )}
              </div>
            </Grid>
          </Grid>
        </AccordionSummary>
        <div className={classes.detailsText}>
          <Typography className={classes.paymentText}>
            Total Cost:
            <span className={classes.data}>{getOrderPrice(order.products)}</span>
          </Typography>
          <Typography className={classes.paymentText}>
            Order ID:
            <span
              className={classes.orderId}
              role="button"
              onClick={(): void => setState({ ...state, showID: !showID })}
              tabIndex={0}
            >
              {showID ? order.id : "Click to show"}
            </span>
          </Typography>
          <Typography className={classes.paymentText}>
            Payment Status:
            <span className={classes.data}>
              <i
                className={
                  order.paymentStatus === "paid"
                    ? `fas fa-check ${classes.successIcon}`
                    : `fas fa-times ${classes.dangerIcon}`
                }
              />
            </span>
          </Typography>
          <Typography className={classes.paymentText}>
            Delivery Status:
            <span className={classes.data}>
              <i
                className={
                  order.shipped
                    ? `fas fa-check ${classes.successIcon}`
                    : `fas fa-times ${classes.dangerIcon}`
                }
              />
            </span>
          </Typography>
        </div>
        <Divider className={classes.divider} />
        <AccordionDetails>
          <Grid container spacing={1}>
            {order.products.map((product, i) => {
              const { title, variant } = product;
              return (
                <Grid item xs={12} sm={order.products.length <= 1 ? 12 : 6} key={i}>
                  <div
                    key={i}
                    style={{
                      marginBottom: 8,
                    }}
                  >
                    <Typography className={classes.details}>{title}</Typography>
                    <Typography className={classes.details}>
                      Cost:{" "}
                      <span className={classes.data}>
                        £{variant.price.item.toFixed(2)} + £
                        {variant.price.postage.toFixed(2)} P&P
                      </span>
                    </Typography>
                    <Typography className={classes.details}>
                      {variant.dimensions}
                    </Typography>
                    <Typography className={classes.details}>
                      Dimensions:{" "}
                      <span className={classes.data}>{variant.dimensions}</span>
                    </Typography>
                    <div className={classes.buttonContainer}>
                      <Button
                        variant="outlined"
                        onClick={(): void =>
                          setState({
                            ...state,
                            dialogOpen: true,
                            currentProduct: product,
                          })
                        }
                        size="small"
                        color="primary"
                      >
                        View Custom Options
                      </Button>
                    </div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </AccordionDetails>
      </Accordion>
      {dialogOpen && currentProduct !== null && (
        <CustomOptionsDialog
          open={dialogOpen}
          product={currentProduct}
          onClose={(): void =>
            setState({ ...state, dialogOpen: false, currentProduct: null })
          }
        />
      )}
    </>
  );
};

export default OrderItem;
