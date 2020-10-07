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
  useTheme,
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
import useScreenWidth from "../../../hooks/useScreenWidth";
import styles from "../styles/orders.style";
import { COLORS } from "../../../themes";

const AdminOrders = (): JSX.Element => {
  const [orders, setOrders] = useState<OrderProps[]>([]);

  const getOrders = async (): Promise<void> => {
    const { data } = await API.graphql(graphqlOperation(listOrders));
    setOrders(data.listOrders.items);
  };

  const [expanded, setExpanded] = useState<string | boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [trackingSelect, setTrackingInfo] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [trackingArray, setMultipleTracking] = useState<{ [key: string]: string }[]>([]);
  const [currentOrder, setCurrentOrder] = useState<OrderProps | null>(null);
  const [inputError, setInputError] = useState<string>("");
  const [isSending, setSending] = useState<boolean>(false);

  useEffect(() => {
    getOrders();
  }, []);

  dayjs.extend(localizedFormat);

  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_AWS,
    secretAccessKey: process.env.SECRET_KEY_AWS,
  });

  // make and use styles for use in the component
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  /**
   * useScreenWidth hook is used to change styles based on whether screen
   * is smaller/larger than input parameter
   */
  const desktop = useScreenWidth(600);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

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

  const getSignedDownloadURL = (s3Image: S3ImageProps): string => {
    const { key, bucket } = s3Image;
    const s3 = new AWS.S3({
      signatureVersion: "v4",
      region: "eu-west-2",
      accessKeyId: process.env.ACCESS_KEY_AWS,
      secretAccessKey: process.env.SECRET_KEY_AWS,
    });
    const expiry = 60 * 60; // 1 hour (60 seconds * 60 mins)

    const url = s3.getSignedUrl("getObject", {
      Bucket: bucket,
      Key: `public/${key}`,
      Expires: expiry,
    });
    return url;
  };

  const downloadProductImages = (product: GraphQlProduct): void => {
    const { customOptions } = product;
    const options = [];
    for (const option of customOptions) {
      options.push(JSON.parse(option));
    }
    for (const option of options) {
      if (Object.keys(option)[0] === "Images") {
        (Object.values(option)[0] as S3ImageProps[]).forEach((s3) => {
          const url = getSignedDownloadURL(s3);
          console.log(url);
          const a = document.createElement("a");
          a.download = url;
          a.setAttribute("href", url);
          a.setAttribute("style", "display: none");
          a.setAttribute("target", "_blank");
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
      }
    }
  };

  const handleSetOrder = (order: OrderProps): void => {
    try {
      setLoading(true);
      setTimeout(async () => {
        await API.post("orderlambda", "/orders/set-order-processing", {
          body: {
            isProcessed: order.orderProcessed ? !order.orderProcessed : true,
            orderId: order.id,
          },
        });
        setLoading(false);
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  };

  const closeDialog = (): void => {
    setDialogOpen(false);
    setMultipleTracking([]);
    setInputValue("");
  };

  const handleSendConfirmation = async (order: OrderProps): Promise<void> => {
    try {
      setSending(true);
      const response = await API.post(
        "orderlambda",
        "/orders/send-shipping-information",
        {
          body: {
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
      setSending(false);
      closeDialog();
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const renderShippingInput = (order: OrderProps): JSX.Element | null => {
    let jsx: JSX.Element | null = null;
    switch (trackingSelect) {
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
        jsx =
          trackingArray.length < order.products.length ? (
            <div style={{ display: "inline-flex", width: "100%", marginTop: 8 }}>
              <TextField
                variant="outlined"
                label={`${order.products[trackingArray.length].title}`}
                onChange={(e): void => {
                  setInputError("");
                  setInputValue(e.target.value);
                }}
                value={inputValue}
                error={!!inputError}
                helperText={inputError}
                style={{ width: "75%" }}
              />
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
        fullScreen={fullScreen}
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
                <MenuItem value="one">Yes, 1 for each item</MenuItem>
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
