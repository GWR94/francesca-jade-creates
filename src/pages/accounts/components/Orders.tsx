import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import dayjs from "dayjs";
import { ExpandMoreRounded } from "@material-ui/icons";
import { API, graphqlOperation } from "aws-amplify";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { S3Image } from "aws-amplify-react";
import Loading from "../../../common/Loading";
import Pagination from "../../../common/Pagination";
import { getUser } from "../../../graphql/queries";
import { AppState } from "../../../store/store";
import useScreenWidth from "../../../hooks/useScreenWidth";
import styles from "../styles/orders.style";
import { S3ImageProps } from "../interfaces/Product.i";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import { GraphQlProduct, OrderProps } from "../interfaces/Orders.i";
import { UserAttributeProps } from "../interfaces/Accounts.i";

interface OrdersProps {
  userAttributes: UserAttributeProps | null;
}

/**
 * A functional component which renders all of the current authenticated
 * users orders
 */
const Orders: React.FC<OrdersProps> = (): JSX.Element => {
  // isLoading is used to show/hide loading UI effects
  const [isLoading, setLoading] = useState(true);
  // initialise a variable to store orders in state so they can be used through the component
  const [orders, setOrders] = useState<OrderProps[]>([]);

  /**
   * useScreenWidth hook is used to change styles based on whether screen
   * is smaller/larger than input parameter
   */
  const desktop = useScreenWidth(600);

  // initialise a variable to keep track of the current orders rendered in the component
  const [pages, setPages] = useState({
    min: 0,
    max: desktop ? 10 : 5,
  });
  // initialise a variable to check which accordion component is expanded
  const [expanded, setExpanded] = useState<string | boolean>(false);
  // initialise a variable to show if the dialog component is visible or not.
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  // initialise a variable for the current product being view (for viewing in dialog)
  const [currentProduct, setCurrentProduct] = useState<GraphQlProduct | null>(null);

  // extend dayjs to have local formatting per users' location
  dayjs.extend(localizedFormat);

  // make and use styles for use in the component
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  // get the users sub for use in graphQL or AWS methods.
  const sub = useSelector(({ user }: AppState) => user.id);

  // get the users' orders as soon as the component mounts
  useEffect(() => {
    /**
     * Function to retrieve the users data, and then the users' orders based
     * on the current authenticated user.
     */
    const getOrders = async (): Promise<void> => {
      try {
        const { data } = await API.graphql(graphqlOperation(getUser, { id: sub }));
        console.log(data, sub);
        const orders = data.getUser.orders.items;
        // set orders into state so it can be used throughout the component
        console.log(orders);
        setOrders(orders);
      } catch (err) {
        console.error(err);
      }
      // remove all loading UI effects.
      setLoading(false);
    };

    getOrders();
  }, []);

  /**
   * Function to open/close a panel inside the Accordion component.
   * @param {string} panel - The panel which is expected to be opened/closed
   */
  const handlePanelChange = (panel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean,
  ): void => {
    // Opens panel if its closed, or closes it if it's open.
    setExpanded(isExpanded ? panel : false);
  };

  /**
   * Function which returns the full price of all the products in the order.
   * @param products - Array of products to retrieve the accumulative price from
   */
  const getOrderPrice = (products: GraphQlProduct[]): string => {
    let price = 0;
    products.map((product) => {
      price += product.price + product.shippingCost;
    });
    return `£${price.toFixed(2)}`;
  };

  const { min, max } = pages;

  return isLoading ? (
    <Loading />
  ) : (
    <div className={classes.root}>
      <Accordion expanded={false}>
        <AccordionSummary>
          <Grid container style={{ marginRight: 30 }}>
            <Grid item xs={6}>
              <Typography className={classes.headingTitle}>Order Date</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.secondaryTitle}>Payment Status</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
      </Accordion>
      {orders
        // sort the orders by createdAt
        .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        // slice the array to only show a maximum of 10 orders on a page
        .slice(min, max)
        .map((order, i) => {
          return (
            <Accordion
              expanded={expanded === `panel${i}`}
              key={i}
              onChange={handlePanelChange(`panel${i}`)}
              TransitionProps={{ unmountOnExit: true }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreRounded />}
                aria-controls={`panel${i}-content`}
                id={`panel${i}-header`}
                style={{ alignItems: "center" }}
              >
                <Grid container style={{ marginRight: -30 }}>
                  <Grid item xs={6}>
                    <Typography className={classes.heading}>
                      {dayjs(order.createdAt).format(desktop ? "llll" : "l")}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} style={{ display: "flex", justifyContent: "center" }}>
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
                <Typography className={classes.orderId}>
                  Order ID:
                  <span className={classes.data}>{order.id}</span>
                </Typography>
              </div>
              <AccordionDetails>
                <Grid container spacing={1}>
                  {order.products.map((product, i) => {
                    const { title, price, shippingCost, variant } = product;
                    return (
                      <Grid item xs={12} sm={6} key={i}>
                        <div key={i} style={{ marginBottom: 8 }}>
                          <Typography className={classes.details}>{title}</Typography>
                          <Typography className={classes.details}>
                            Cost:{" "}
                            <span className={classes.data}>
                              £{price.toFixed(2)} + £{shippingCost.toFixed(2)} P&P
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
                              onClick={(): void => {
                                setDialogOpen(true);
                                setCurrentProduct(product);
                              }}
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
          );
        })}
      {dialogOpen && currentProduct !== null && (
        <Dialog open={dialogOpen} onClose={(): void => setDialogOpen(false)}>
          <DialogTitle>{currentProduct!.title} Custom Options</DialogTitle>
          <DialogContent>
            {currentProduct.customOptions.map((option, i) => {
              const data: { [key: string]: string[] | S3ImageProps[] } = JSON.parse(
                option,
              );
              return Object.keys(data)[0] === "Images" ? (
                <div key={i}>
                  <Typography className={classes.details} gutterBottom>
                    Custom Images:
                  </Typography>
                  <div className={classes.imageContainer}>
                    <Splide
                      options={{
                        width: 300,
                        arrows: Object.values(data)[0].length > 1,
                      }}
                    >
                      {(Object.values(data)[0] as S3ImageProps[]).map((image, i) => {
                        return (
                          <SplideSlide key={i} style={{ width: "100%" }}>
                            <S3Image
                              imgKey={image.key}
                              theme={{
                                photoImg: {
                                  width: 300,
                                },
                              }}
                              level="private"
                            />
                          </SplideSlide>
                        );
                      })}
                    </Splide>
                  </div>
                </div>
              ) : (
                <Typography className={classes.details} gutterBottom key={i}>
                  {Object.keys(data)[0]}:
                  <span className={classes.data}>{Object.values(data)[0]}</span>
                </Typography>
              );
            })}
          </DialogContent>
          <DialogActions>
            <Button
              color="secondary"
              size="small"
              variant="text"
              onClick={(): void => setDialogOpen(false)}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Pagination
        dataLength={orders.length}
        numPerPage={!desktop ? 5 : 10}
        setPageValues={({ min, max }): void => setPages({ min, max })}
      />
    </div>
  );
};

export default Orders;
