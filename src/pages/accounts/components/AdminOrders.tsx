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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
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
import { COLORS } from "../../../themes";

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

  /**
   * Function to retrieve all of the latest orders via the graphql query "listOrders".
   * This function will be executed when the component mounts
   */
  const getOrders = async (): Promise<void> => {
    const { data } = await API.graphql(graphqlOperation(listOrders));
    setOrders(data.listOrders.items);
  };

  // the index of the current expanded accordion which is open (false if nothing is open)
  const [expanded, setExpanded] = useState<string | boolean>(false);
  // boolean value to show/hide loading UI effects
  const [isLoading, setLoading] = useState<boolean>(false);
  // boolean value to determine if the shipping dialog is open
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  // value to hold the current selected value on the tracking select.
  const [trackingSelect, setTrackingInfo] = useState<string>("");
  // value to hold the current input value
  const [inputValue, setInputValue] = useState<string>("");
  // value to track the current tracking array values.
  const [trackingArray, setMultipleTracking] = useState<{ [key: string]: string }[]>([]);
  // state to keep track of the current order
  const [currentOrder, setCurrentOrder] = useState<OrderProps | null>(null);
  // value to hold any potential errors
  const [inputError, setInputError] = useState<string>("");
  // boolean value to show/hide loading UI effects while sending email
  const [isSending, setSending] = useState<boolean>(false);

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
    setExpanded(isExpanded ? panel : false);
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
   * Function to get a signed url to download the input S3 image (s3Image).
   * @param s3Image - The image of the S3 image that the user wants a signed
   * URL for.
   */
  const getSignedDownloadURL = (s3Image: S3ImageProps): string => {
    // destructure the key and bucket
    const { key, bucket, region } = s3Image;
    // create a new instance of AWS.S3
    const s3 = new AWS.S3({
      // use the latest signature
      signatureVersion: "v4",
      // set region to be the same as the image
      region,
    });
    // set expire to be 1 hour (60 seconds * 60 mins)
    const expiry = 60 * 60;

    // use s3 to get a signed url
    const url = s3.getSignedUrl("getObject", {
      Bucket: bucket,
      Key: `public/${key}`,
      Expires: expiry,
    });
    // return the url
    return url;
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
    // initialise an empty array to hold parsed custom options.
    const options = [];
    /**
     * iterate through each custom option, parse it (as it's JSON in the
     * database), and push it to the options array.
     */
    for (const option of customOptions) {
      options.push(JSON.parse(option));
    }
    /**
     * Filter the options array to only contain images. This is done by
     * filtering the keys of the option to only be "Images". There can
     * only be one key of "Images", so the first can be returned.
     */
    const images = Object.values(
      options.filter((option) => Object.keys(option)[0] === "Images")[0],
    )[0];

    /**
     * Iterate through each of the images in the array, get the signed URL
     * for each, and simulate a click to open all images to be downloaded.
     */
    for (const image of images as S3ImageProps[]) {
      // get the signed url
      const url = getSignedDownloadURL(image);
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
  const handleSetOrder = (order: OrderProps): void => {
    try {
      // set loading to true so loading UI effects are shown to user
      setLoading(true);
      // set a timeout so UI effects don't instantly stop
      setTimeout(async () => {
        // execute lambda function to update the database
        await API.post("orderlambda", "/orders/set-order-processing", {
          body: {
            isProcessed: order.orderProcessed ? !order.orderProcessed : true,
            orderId: order.id,
          },
        });
        // set loading to be false to remove UI loading effects
        setLoading(false);
        // reload the window to show updated data to user
        window.location.reload();
      }, 1000);
    } catch (err) {
      // FIXME - should remove after testing
      console.error(err);
    }
  };

  /**
   * Function to close the tracking dialog and reset all of it's relevant state
   * to it's initial (empty) values.
   */
  const closeDialog = (): void => {
    // close the dialog
    setDialogOpen(false);
    // set array to be empty
    setMultipleTracking([]);
    // set input to be an empty string
    setInputValue("");
  };

  /**
   * Function to send a confirmation email to the user who ordered a product once
   * the admin has marked an order as sent and tracking information has been added.
   * @param order - The order that has been completed. Order will contain all of
   * the relevant information - such as email address and order details - to send
   * the confirmation email.
   */
  const handleSendConfirmation = async (order: OrderProps): Promise<void> => {
    try {
      // set sending to true so loading UI effects are shown
      setSending(true);
      // execute the lambda function with relevant data from state
      const response = await API.post(
        "orderlambda",
        "/orders/send-shipping-information",
        {
          body: {
            // add order to body
            order,
            trackingInfo:
              // if there is an array of tracking numbers, use that
              trackingArray.length > 0
                ? trackingArray
                : // else if there is a value for an individual tracking number, use it
                inputValue.length > 0
                ? inputValue
                : // return null if theres neither an array nor value
                  null,
          },
        },
      );
      // remove loading UI effects
      setSending(false);
      // close the dialog
      closeDialog();
      // FIXME - should be removed after testing
      console.log(response);
    } catch (err) {
      // FIXME - should be removed after testing
      console.error(err);
    }
  };

  /**
   * Function to render an input based on the selected trackingSelect index
   * from state.
   * @param order - The order which the admin wants to add tracking info
   * to.
   */
  const renderShippingInput = (order: OrderProps): JSX.Element | null => {
    let jsx: JSX.Element | null = null;
    switch (trackingSelect) {
      // if trackingSelect is "all" render a single text field
      case "all":
        jsx = (
          <TextField
            variant="outlined"
            label="Tracking Number"
            value={inputValue}
            fullWidth
            onChange={(e): void => setInputValue(e.target.value)}
            style={{ marginTop: 8 }}
          />
        );
        break;
      case "one": {
        /**
         * if trackingSelect is "one" then a TextField should be rendered for each product
         * in the order.
         */
        jsx =
          trackingArray.length < order.products.length ? (
            <div style={{ display: "inline-flex", width: "100%", marginTop: 8 }}>
              {/* Render the TextField component for current product */}
              <TextField
                variant="outlined"
                // set label to be the current products title
                label={`${order.products[trackingArray.length].title}`}
                onChange={(e): void => {
                  // remove any errors when the input value is updated
                  setInputError("");
                  // set the input value into state
                  setInputValue(e.target.value);
                }}
                value={inputValue}
                // only show errors if there are errors present
                error={!!inputError}
                // show the helper text when there's an erro
                helperText={inputError}
                style={{ width: "75%" }}
              />
              {/* Allow the admin to confirm their tracking number and move onto the next product */}
              <Button
                variant="text"
                onClick={(): void => {
                  const title = order.products[trackingArray.length].title;
                  if (!trackingArray.length) {
                    setMultipleTracking([
                      ...trackingArray,
                      {
                        [title]: inputValue,
                      },
                    ]);
                    setInputValue("");
                    return;
                  }
                  trackingArray.forEach((tracking) => {
                    if (
                      Object.keys(tracking).findIndex((item) => item === title) === -1
                    ) {
                      setMultipleTracking([
                        ...trackingArray,
                        {
                          [title]: inputValue,
                        },
                      ]);
                      setInputValue("");
                    }
                  });
                }}
                style={{ width: "25%", height: 54 }}
                disabled={!inputValue.length}
              >
                Add Item
              </Button>
            </div>
          ) : null;
        break;
      }
      case "none":
        jsx = null;
        break;
    }
    return jsx;
  };

  return (
    <>
      <Container>
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
        {orders.map((order, i) => {
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
                      {order.paymentStatus === "paid" ? (
                        <Chip
                          className={classes.chipSuccess}
                          size="small"
                          color="primary"
                          label={desktop ? "Paid" : <AttachMoney />}
                        />
                      ) : (
                        <Chip
                          className={classes.chipDanger}
                          size="small"
                          color="secondary"
                          label={desktop ? "Unpaid" : <MoneyOff />}
                        />
                      )}
                      {order.shipped ? (
                        <Chip
                          className={classes.chipSuccess}
                          size="small"
                          color="primary"
                          label={desktop ? "Shipped" : <Send />}
                        />
                      ) : (
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
                    const options: { [key: string]: string | string[] }[] = [];
                    customOptions.forEach((option) => options.push(JSON.parse(option)));
                    return (
                      <Grid item xs={12} sm={order.products.length <= 1 ? 12 : 6} key={i}>
                        <div key={i} className={classes.variantContainer}>
                          <Typography
                            className={classes.details}
                            style={{ textAlign: "center", textDecoration: "underline" }}
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
                              option.hasOwnProperty("Images"),
                            ) && (
                              <Button
                                variant="text"
                                onClick={(): void => {
                                  downloadProductImages(product);
                                }}
                                size="small"
                                color="primary"
                                style={{ marginTop: 12 }}
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
              {order.paymentStatus !== "paid" && (
                <Typography className={classes.orderText}>
                  Note: Order not paid (yet)
                </Typography>
              )}
              <AccordionActions>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.paymentButton}
                  onClick={(): void => handleSetOrder(order)}
                  disabled={order.paymentStatus !== "paid"}
                  size="small"
                >
                  {isLoading ? (
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
                    setCurrentOrder(order);
                    setDialogOpen(true);
                  }}
                >
                  Add Shipping Info
                </Button>
              </AccordionActions>
            </Accordion>
          );
        })}
      </Container>
      <Dialog
        open={dialogOpen && currentOrder !== null}
        onClose={closeDialog}
        fullScreen={!desktop}
      >
        <DialogTitle>Enter Shipping References</DialogTitle>
        <DialogContent>
          <Typography>Do you have tracking information for the products?</Typography>
          <div className={classes.selectContainer}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Tracking Data</InputLabel>
              <Select
                value={trackingSelect}
                onChange={(e): void => setTrackingInfo(e.target.value as string)}
                label="Tracking Data"
                fullWidth
              >
                {currentOrder?.products.length! > 1 && (
                  <MenuItem value="one">Yes, 1 for each item</MenuItem>
                )}
                <MenuItem value="all">Yes, 1 for all items</MenuItem>
                <MenuItem value="none">No, just email customer</MenuItem>
              </Select>
            </FormControl>
          </div>
          {trackingSelect.length > 0 && renderShippingInput(currentOrder as OrderProps)}
          <ol className={classes.trackingList}>
            {trackingArray.map((track, i) => {
              return (
                <li value={i + 1} key={i}>
                  {Object.values(track)[0]}
                  <i
                    className={`fas fa-times animated pulse infinite ${classes.deleteIcon}`}
                    onClick={(): void =>
                      setMultipleTracking([
                        ...trackingArray.slice(0, i),
                        ...trackingArray.slice(i + 1),
                      ])
                    }
                    tabIndex={0}
                    role="button"
                  />
                </li>
              );
            })}
          </ol>
        </DialogContent>
        <DialogActions>
          <Button variant="text" color="secondary" onClick={closeDialog}>
            Cancel
          </Button>
          <Button
            variant="text"
            color="inherit"
            className={classes.sendButton}
            disabled={trackingSelect.length === 0}
            onClick={(): Promise<void> =>
              handleSendConfirmation(currentOrder as OrderProps)
            }
          >
            {isSending ? (
              <CircularProgress
                style={{ color: COLORS.SuccessGreen }}
                color="inherit"
                size={20}
              />
            ) : (
              "Send Email"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminOrders;
