import {
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { API } from "aws-amplify";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../store/store";
import { COLORS } from "../../../themes";
import { GraphQlProduct, OrderProps } from "../interfaces/Orders.i";
import styles from "../styles/shipping.style";

interface ShippingReferenceProps {
  currentOrder: OrderProps;
  dialogOpen: boolean;
  closeDialog: () => void;
  desktop: boolean;
}

type TrackingSelect = "one" | "all" | "none" | "";

interface ShippingReferenceState {
  trackingSelect: TrackingSelect;
  inputValue: string;
  trackingArray: { [key: string]: string }[];
  inputError: "";
  isSending: boolean;
}

const ShippingReferenceDialog = ({
  currentOrder,
  dialogOpen,
  closeDialog,
  desktop,
}: ShippingReferenceProps): JSX.Element => {
  const [state, setState] = useState<ShippingReferenceState>({
    trackingSelect: "",
    inputValue: "",
    trackingArray: [],
    inputError: "",
    isSending: false,
  });

  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const { username } = useSelector(({ user }: AppState) => user);

  /**
   * Function to send a confirmation email to the user who ordered a product once
   * the admin has marked an order as sent and tracking information has been added.
   * @param order - The order that has been completed. Order will contain all of
   * the relevant information - such as email address and order details - to send
   * the confirmation email.
   */
  const handleSendConfirmation = async (): Promise<void> => {
    const { trackingArray, inputValue } = state;
    try {
      // set sending to true so loading UI effects are shown
      setState({ ...state, isSending: true });

      const getSum = (total: number, product: GraphQlProduct): number =>
        total + product.price * 100 + product.shippingCost * 100;

      const cost = currentOrder.products.reduce(getSum, 0) / 100;
      try {
        const response = await API.post(
          "orderlambda",
          "/orders/send-shipping-information",
          {
            body: {
              // add order to body
              order: currentOrder,
              trackingInfo:
                // if there is an array of tracking numbers, use that
                trackingArray.length > 0
                  ? trackingArray
                  : // else if there is a value for an individual tracking number, use it
                  inputValue.length > 0
                  ? inputValue
                  : // return null if theres neither an array nor value
                    null,
              username,
              cost,
            },
          },
        );
        console.log(response);
      } catch (err) {
        console.error(err);
      }
      // remove loading UI effects
      setState({ ...state, isSending: false, trackingArray: [], inputValue: "" });
      // close the dialog
      closeDialog();
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
    const { trackingSelect, inputValue, trackingArray, inputError } = state;
    let jsx: JSX.Element | null = null;
    switch (trackingSelect) {
      // if trackingSelect is "all" render a single text field
      case "all":
        jsx = (
          <TextField
            variant="outlined"
            label="Tracking Number"
            value={inputValue}
            error={!!inputError}
            helperText={inputError}
            fullWidth
            onChange={(e): void => {
              setState({
                ...state,
                inputValue: e.target.value,
                inputError: "",
              });
            }}
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
            <div
              style={{
                display: "inline-flex",
                width: "100%",
                marginTop: 8,
              }}
            >
              {/* Render the TextField component for current product */}
              <TextField
                variant="outlined"
                // set label to be the current products title
                label={`${order.products[trackingArray.length].title}`}
                onChange={(e): void => {
                  setState({
                    ...state,
                    inputError: "",
                    inputValue: e.target.value,
                  });
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
                    return setState({
                      ...state,
                      trackingArray: [
                        ...trackingArray, // FIXME - test removal
                        {
                          [title]: inputValue,
                        },
                      ],
                      inputValue: "",
                    });
                  }
                  trackingArray.forEach((tracking) => {
                    if (
                      Object.keys(tracking).findIndex((item) => item === title) === -1
                    ) {
                      setState({
                        ...state,
                        trackingArray: [
                          ...trackingArray,
                          {
                            [title]: inputValue,
                          },
                        ],
                        inputValue: "",
                      });
                    }
                  });
                }}
                style={{
                  width: "25%",
                  height: 54,
                }}
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

  const { trackingSelect, inputValue, trackingArray, isSending } = state;

  return (
    <Dialog
      // only allow it to be open if the is a value in currentOrder and dialogOpen is true
      open={dialogOpen && currentOrder !== null}
      onClose={closeDialog}
      // set fullscreen to true if screen width is less than 600px
      fullScreen={!desktop}
      classes={{
        paper: desktop ? classes.dialog : "",
      }}
    >
      <DialogTitle>Enter Shipping References</DialogTitle>
      <DialogContent>
        <Typography>Do you have tracking information for the products?</Typography>
        <div className={classes.selectContainer}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Tracking Data</InputLabel>
            <Select
              value={trackingSelect}
              onChange={(e): void =>
                setState({ ...state, trackingSelect: e.target.value as TrackingSelect })
              }
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
                    setState({
                      ...state,
                      trackingArray: [
                        ...trackingArray.slice(0, i),
                        ...trackingArray.slice(i + 1),
                      ],
                    })
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
          disabled={
            (trackingSelect === "one" &&
              trackingArray.length !== currentOrder.products.length) ||
            (trackingSelect === "all" && inputValue.length === 0) ||
            trackingSelect === ""
          }
          onClick={(): Promise<void> => handleSendConfirmation()}
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
  );
};

export default ShippingReferenceDialog;
