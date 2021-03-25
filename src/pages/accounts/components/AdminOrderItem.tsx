import React, { ChangeEvent, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  Grid,
  Typography,
  AccordionDetails,
  Button,
  AccordionActions,
  CircularProgress,
  useMediaQuery,
  makeStyles,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";
import { ExpandMoreRounded } from "@material-ui/icons";
import dayjs from "dayjs";
import { API } from "aws-amplify";
import { COLORS } from "../../../themes";
import { openSnackbar } from "../../../utils/Notifier";
import { GraphQlProduct, OrderProps } from "../interfaces/Orders.i";
import { S3ImageProps } from "../interfaces/Product.i";
import styles from "../styles/adminOrders.style";
import ShippingReferenceDialog from "./ShippingReferenceDialog";
import { getReadableStringFromArray } from "../../../utils";
import ImageCarousel from "../../../common/containers/ImageCarousel";

interface AdminOrderItemProps {
  order: OrderProps;
  i: number;
  expanded: string | false;
  handlePanelChange: (
    panel: string,
  ) => (event: ChangeEvent<{}>, expanded: boolean) => void;
}

interface AdminOrderItemState {
  expanded: boolean | string;
  isSettingProcessed: boolean;
  dialogOpen: boolean;
  showID: boolean;
  imageDialogOpen: boolean;
  currentImages: S3ImageProps[];
}

const initialState: AdminOrderItemState = {
  expanded: false,
  isSettingProcessed: false,
  dialogOpen: false,
  showID: false,
  imageDialogOpen: false,
  currentImages: [],
};

const AdminOrderItem: React.FC<AdminOrderItemProps> = ({
  order,
  i,
  expanded,
  handlePanelChange,
}) => {
  const [state, setState] = useState<AdminOrderItemState>(initialState);

  const desktop = useMediaQuery("(min-width: 600px)");

  const useStyles = makeStyles(styles);
  const classes = useStyles();

  /**
   * Function to update the order status of the input order - i.e if the
   * orderProcessed was true, it will now be false, and vice versa.
   * @param order - The order to update with the updated order values.
   */
  const handleOrderProcessing = async (): Promise<void> => {
    try {
      // set loading to true so loading UI effects are shown to user
      setState({
        ...state,
        isSettingProcessed: true,
      });
      // set a timeout so UI effects don't instantly stop
      // execute lambda function to update the database
      await API.post("orderlambda", "/orders/set-order-processing", {
        body: {
          isProcessed: order.orderProcessed ? false : true,
          orderId: order.id,
        },
      });
      setTimeout(() => {
        // set loading to be false to remove UI loading effects
        setState({
          ...state,
          isSettingProcessed: false,
        });
        // reload the window to show updated data to user
        window.location.reload();
      }, 1000);
    } catch (err) {
      openSnackbar({
        severity: "error",
        message: "Unable to update order status. Please try again.",
      });
    }
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
      price += product.variant.price.item + product.variant.price.postage;
    });
    // return price in correct format as string
    return `£${price.toFixed(2)}`;
  };

  const handleViewImages = (options: { [key: string]: unknown }[]): void => {
    const imagesArr = options.filter((option) => option.hasOwnProperty("Images"))[0] as {
      [key: string]: S3ImageProps[];
    };
    const images = Object.values(imagesArr)[0] as S3ImageProps[];
    setState({ ...state, imageDialogOpen: true, currentImages: images });
  };

  const {
    isSettingProcessed,
    dialogOpen,
    showID,
    imageDialogOpen,
    currentImages,
  } = state;
  return (
    <>
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
                {/* If order is paid, render a green success chip */}
                {order.paymentStatus === "paid" ? (
                  order.shipped ? (
                    <Typography className={classes.shipped}>Shipped</Typography>
                  ) : (
                    <Typography className={classes.paid}>Paid</Typography>
                  )
                ) : (
                  // If the order is not paid, render a red danger chip
                  <Typography className={classes.unpaid}>Unpaid</Typography>
                )}
                {/* If order is shipped, render a green success chip */}
              </div>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          {/* Render all of the details from the order */}
          <Grid container spacing={0}>
            <Grid item xs={12} sm={6}>
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
            </Grid>
            <Grid item xs={12} sm={6} style={{ marginBottom: 20 }}>
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
            </Grid>
            <Divider className={classes.divider} />
            {order.products.map((product, i) => {
              const { title, variant, customOptions } = product;
              const options: {
                [key: string]: string | string[];
              }[] = [];
              customOptions.forEach((option) => {
                if (option) {
                  options.push(JSON.parse(option));
                }
              });
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
                      Cost:
                      <span className={classes.data}>
                        £{variant.price.item.toFixed(2)} + £
                        {variant.price.postage.toFixed(2)} P&P
                      </span>
                    </Typography>
                    {variant.variantName !== variant.dimensions && (
                      <Typography className={classes.details}>
                        {variant.variantName}
                      </Typography>
                    )}
                    <Typography className={classes.details}>
                      Dimensions:
                      <span className={classes.data}>{variant.dimensions}</span>
                    </Typography>
                    <Typography className={classes.details} style={{ marginTop: 10 }}>
                      Custom Options:
                    </Typography>
                    {options.map((option) => {
                      const title = Object.keys(option)[0];
                      const value = Object.values(option)[0];
                      const isArray = Array.isArray(value);
                      return (
                        <div>
                          <Typography className={classes.details}>
                            {title}:
                            {!isArray ? (
                              <span className={classes.data}>{value}</span>
                            ) : title === "Images" ? (
                              <span className={classes.data}>
                                {value.length} uploaded.
                              </span>
                            ) : (
                              <span className={classes.data}>
                                {getReadableStringFromArray(value as string[])}
                              </span>
                            )}
                          </Typography>
                        </div>
                      );
                    })}
                    <div className={classes.buttonContainer}>
                      {options.some((option) => option?.hasOwnProperty("Images")) && (
                        <Button
                          variant="text"
                          onClick={(): void => handleViewImages(options)}
                          size="small"
                          color="primary"
                          style={{
                            marginTop: 12,
                          }}
                        >
                          View Custom Images
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
            color="inherit"
            className={classes.paymentButton}
            onClick={handleOrderProcessing}
            disabled={order.paymentStatus !== "paid"}
            size="small"
            style={{
              backgroundColor: COLORS.SuccessGreen,
              color: "#fff",
            }}
          >
            {isSettingProcessed ? (
              <CircularProgress size={20} style={{ color: "#fff" }} color="inherit" />
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
                dialogOpen: true,
              });
            }}
          >
            {order.shipped ? "Edit" : "Add"} Shipping Info
          </Button>
        </AccordionActions>
      </Accordion>
      <ShippingReferenceDialog
        order={order}
        dialogOpen={dialogOpen}
        closeDialog={(): void => setState({ ...state, dialogOpen: false })}
        desktop={desktop}
      />
      <Dialog
        open={imageDialogOpen}
        onClose={(): void => setState({ ...state, imageDialogOpen: false })}
        fullScreen={useMediaQuery("(max-width: 640px)")}
      >
        <DialogTitle>Custom Images</DialogTitle>
        <div className={classes.dialog}>
          <ImageCarousel images={currentImages} />
        </div>
        <DialogActions>
          <Button
            variant="text"
            color="secondary"
            onClick={(): void => setState({ ...state, imageDialogOpen: false })}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminOrderItem;
