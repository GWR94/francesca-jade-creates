import { API, graphqlOperation } from "aws-amplify";
import React, { useEffect, useState } from "react";
import AWS from "aws-sdk";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  makeStyles,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {
  AttachMoney,
  CancelScheduleSend,
  ExpandMoreRounded,
  MoneyOff,
  Send,
} from "@material-ui/icons";
import { listOrders } from "../../../graphql/queries";
import { S3ImageProps } from "../interfaces/Product.i";
import { GraphQlProduct, OrderProps } from "../interfaces/Orders.i";
import styles from "../styles/orders.style";
import Pagination from "../../../common/Pagination";
import ShippingReferenceDialog from "./ShippingReferenceDialog";
import { getSignedS3Url } from "../../../utils";

/**
 * TODO
 * [ ] Fix shipping references title overflowing in dialog
 */

/**
 * Functional component to render a table of all of the orders that have been
 * placed, but only if the user is an admin. The admin can see an overview of
 * all orders to quickly see if the orders have been paid, and if they have
 * been marked as shipped or not. The admin can also download all of the custom
 * images needed to create the order.
 */
const AdminOrders = (): JSX.Element => {
  // initialise state to store orders in as an empty array (which will be filled when component mounts)
  const [orders, setOrders] = useState<OrderProps[]>([]);

  interface AdminOrdersState {
    expanded: boolean | string;
    isSettingStatus: boolean;
    dialogOpen: boolean;
    currentOrder: OrderProps | null;
    inputError: string;
    isSending: boolean;
    isLoading: boolean;
    showPages: {
      min: number;
      max: number;
    };
  }

  const [state, setState] = useState<AdminOrdersState>({
    expanded: false,
    isSettingStatus: false,
    dialogOpen: false,
    currentOrder: null,
    inputError: "",
    isSending: false,
    isLoading: true,
    showPages: {
      min: 0,
      max: 12,
    },
  });

  /**
   * Function to retrieve all of the latest orders via the graphql query "listOrders".
   * This function will be executed when the component mounts
   */
  const getOrders = async (): Promise<void> => {
    // retrieve the orders data via the listOrders graphql query
    const { data } = await API.graphql(graphqlOperation(listOrders));
    // store the actual items into a variable
    const items: OrderProps[] = data.listOrders.items;
    // sort the items via their createdAt data (descending)
    const sorted = items.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    // set orders into state
    setOrders(sorted);
    // create a small timeout so the spinner doesn't stop instantly if on fast connection
    setTimeout(() => {
      // remove loading UI effects
      setState({ ...state, isLoading: false });
    }, 500);
  };

  let isMounted = false;
  useEffect(() => {
    // isMounted is used for suppressing react error of updating unmounted component
    isMounted = true;
    // if the component is mounted, execute the getOrders function
    if (isMounted) getOrders();
    return (): void => {
      // set isMounted to false when the component is unmounted.
      isMounted = false;
    };
  }, []);

  // extend localizedFormat extension for dayjs to format dates correctly
  dayjs.extend(localizedFormat);

  // update AWS with access and secret keys.
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_AWS,
    secretAccessKey: process.env.SECRET_KEY_AWS,
  });

  // make and use styles for use in the component
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  /**
   * useMediaQuery hook is used to change styles based on whether screen
   * is smaller/larger than input parameter. This will be used to
   * determine if the dialog should be full screen, and will change the
   * content of some parts of the component to fit mobile/desktop
   * respectively.
   */
  const desktop = useMediaQuery("(min-width: 600px)");

  /**
   * Function to open/close a panel inside the Accordion component.
   * @param {string} panel - The panel which is expected to be opened/closed
   */
  const handlePanelChange = (panel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean,
  ): void => {
    // Opens panel if its closed, or closes it if it's open.
    setState({
      ...state,
      expanded: isExpanded ? panel : false,
    });
  };

  /**
   * Function which returns the full price of all the products in the order.
   * @param products - Array of products to retrieve the accumulative price from
   * @returns string - Returns the string of the accumulative price at a fixed
   * number of 2 decimal places.
   */
  const getOrderPrice = (products: GraphQlProduct[]): string => {
    // initialise price to be 0.
    let price = 0;
    products.map((product) => {
      // add the price of the product and shipping cost to price
      price += product.price + product.shippingCost;
    });
    // return price in correct format as string
    return `£${price.toFixed(2)}`;
  };

  /**
   * Function to render a download button to the admin so they can
   * download all of the user's custom images (if there are any)
   * @param product - The completed product with all custom images and
   * data which will be used to retrieve the custom options from.
   */
  const downloadProductImages = (product: GraphQlProduct): void => {
    // destructure customOptions from product
    const { customOptions } = product;
    const images: S3ImageProps[] = [];
    customOptions
      // filter out any falsy values (null or undefined)
      .filter((option) => option)
      // parse the JSON into an object
      .map((option) => JSON.parse(option))
      // filter out all but the images object
      .filter((option) => Object.keys(option)[0] === "Images")
      // push the s3 image object to the images array so it can be used
      .map((option) => images.push(Object.values(option)[0] as S3ImageProps));

    /**
     * Iterate through each of the images in the array, get the signed URL
     * for each, and simulate a click to open all images to be downloaded.
     */
    for (const image of images) {
      // get the signed url
      const url = getSignedS3Url(image.key);
      // create an a element to open the link
      const a = document.createElement("a");
      // set the download attribute to be the signed url
      a.download = url;
      // set the href to be the signed url
      a.setAttribute("href", url);
      // hide the element
      a.setAttribute("style", "display: none");
      // open the url in a new window by setting the target to be _blank
      a.setAttribute("target", "_blank");
      // append the a element to the body
      document.body.appendChild(a);
      // click the a element, which will open/download the image
      a.click();
      // remove the a element from the body.
      document.body.removeChild(a);
    }
  };

  /**
   * Function to update the order status of the input order - i.e if the
   * orderProcessed was true, it will now be false, and vice versa.
   * @param order - The order to update with the updated order values.
   */
  const handleSetOrder = async (order: OrderProps): Promise<void> => {
    try {
      // set loading to true so loading UI effects are shown to user
      setState({
        ...state,
        isSettingStatus: true,
      });
      // set a timeout so UI effects don't instantly stop
      // execute lambda function to update the database
      await API.post("orderlambda", "/orders/set-order-processing", {
        body: {
          isProcessed: order.orderProcessed ? !order.orderProcessed : true,
          orderId: order.id,
        },
      });
      setTimeout(async () => {
        // set loading to be false to remove UI loading effects
        setState({
          ...state,
          isSettingStatus: false,
        });
        // reload the window to show updated data to user
        window.location.reload();
      }, 1000);
    } catch (err) {
      // FIXME - should remove after testing
      console.error(err);
    }
  };

  // destructure values from state for use in component
  const {
    expanded,
    isSettingStatus,
    dialogOpen,
    currentOrder,
    isLoading,
    showPages: { min, max },
  } = state;

  return (
    <Container>
      {/* Create accordion to show the accordions values */}
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
      {/* If isLoading is true, show the loading spinner while data is retrieved */}
      {isLoading ? (
        <CircularProgress
          color="inherit"
          style={{
            color: "#000",
            display: "block",
            margin: "100px auto 80px",
          }}
          size={60}
        />
      ) : (
        // Map all of the orders into their own accordion component
        orders.slice(min, max).map((order, i) => {
          return (
            <Accordion
              expanded={expanded === `panel${i}`}
              onChange={handlePanelChange(`panel${i}`)}
              key={i}
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
                <Grid container style={{ marginRight: -30 }}>
                  <Grid item xs={6}>
                    <Typography className={classes.heading}>
                      {/* Render a minimal format if the user is on mobile, full format if not */}
                      {dayjs(order.createdAt).format(desktop ? "llll" : "l")}
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
                      {/* If order is paid, render a green success chip */}
                      {order.paymentStatus === "paid" ? (
                        <Chip
                          className={classes.chipSuccess}
                          size="small"
                          color="primary"
                          label={desktop ? "Paid" : <AttachMoney />}
                        />
                      ) : (
                        // If the order is not paid, render a red danger chip
                        <Chip
                          className={classes.chipDanger}
                          size="small"
                          color="secondary"
                          label={desktop ? "Unpaid" : <MoneyOff />}
                        />
                      )}
                      {/* If order is shipped, render a green success chip */}
                      {order.shipped ? (
                        <Chip
                          className={classes.chipSuccess}
                          size="small"
                          color="primary"
                          label={desktop ? "Shipped" : <Send />}
                        />
                      ) : (
                        // If order is not shipped, render a red danger chip
                        <Chip
                          className={classes.chipDanger}
                          size="small"
                          color="secondary"
                          label={desktop ? "Not Shipped" : <CancelScheduleSend />}
                        />
                      )}
                    </div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              {/* Render all of the details from the order */}
              <div className={classes.detailsText}>
                <Typography className={classes.orderId}>
                  Total Cost:
                  <span className={classes.data}>{getOrderPrice(order.products)}</span>
                </Typography>
                <Typography className={classes.orderId}>
                  Order ID:
                  <span className={classes.data}>{order.id}</span>
                </Typography>
              </div>
              <AccordionDetails>
                <Grid container spacing={desktop ? 1 : 0}>
                  {order.products.map((product, i) => {
                    const {
                      title,
                      price,
                      shippingCost,
                      variant,
                      customOptions,
                    } = product;
                    const options: {
                      [key: string]: string | string[];
                    }[] = [];
                    customOptions.forEach((option) => options.push(JSON.parse(option)));
                    return (
                      <Grid item xs={12} sm={order.products.length <= 1 ? 12 : 6} key={i}>
                        <div key={i} className={classes.variantContainer}>
                          <Typography
                            className={classes.details}
                            style={{
                              textAlign: "center",
                              textDecoration: "underline",
                            }}
                          >
                            {title}
                          </Typography>
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
                            {options.some((option) =>
                              option?.hasOwnProperty("Images"),
                            ) && (
                              <Button
                                variant="text"
                                onClick={(): void => {
                                  downloadProductImages(product);
                                }}
                                size="small"
                                color="primary"
                                style={{
                                  marginTop: 12,
                                }}
                              >
                                Download Custom Images
                              </Button>
                            )}
                          </div>
                        </div>
                      </Grid>
                    );
                  })}
                </Grid>
              </AccordionDetails>
              {/* Notify the admin if the orders have not been paid for */}
              {order.paymentStatus !== "paid" && (
                <Typography className={classes.orderText}>
                  Note: Order not paid (yet)
                </Typography>
              )}
              {/* Render the items to control setting processing or sending tracking info */}
              <AccordionActions>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.paymentButton}
                  onClick={(): void => {
                    if (currentOrder) handleSetOrder(currentOrder);
                  }}
                  disabled={order.paymentStatus !== "paid"}
                  size="small"
                >
                  {isSettingStatus ? (
                    <CircularProgress
                      size={20}
                      style={{ color: "#fff" }}
                      color="inherit"
                    />
                  ) : order.orderProcessed ? (
                    "Set Unprocessed"
                  ) : (
                    "Set Processing"
                  )}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  className={classes.paymentButton}
                  disabled={order.paymentStatus !== "paid"}
                  onClick={(): void => {
                    setState({
                      ...state,
                      currentOrder: order,
                      dialogOpen: true,
                    });
                  }}
                >
                  Add Shipping Info
                </Button>
              </AccordionActions>
            </Accordion>
          );
        })
      )}
      {/* Render the pagination if there is more than 6 orders in array */}
      {orders.length > 6 && (
        <Pagination
          dataLength={orders.length}
          numPerPage={12}
          setPageValues={({ min, max }): void =>
            setState({
              ...state,
              showPages: {
                ...state.showPages,
                min,
                max,
              },
            })
          }
        />
      )}
      {/* Render Dialog that allows the admin to enter shipping information */}
      {currentOrder !== null && dialogOpen && (
        <ShippingReferenceDialog
          currentOrder={currentOrder}
          dialogOpen={dialogOpen}
          closeDialog={(): void => setState({ ...state, dialogOpen: false })}
          desktop={desktop}
        />
      )}
    </Container>
  );
};

export default AdminOrders;
