import React, { useState } from "react";
// @ts-expect-error
import { isEmail } from "validator";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  useMediaQuery,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  DialogActions,
  CircularProgress,
} from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { API, Auth } from "aws-amplify";
import { Autocomplete } from "@material-ui/lab";
import { spongesArr, buttercreamArr, dripArr, jamArr } from "../../../utils/data";
import {
  QuoteDialogState,
  QuoteDialogProps,
  CakeSize,
} from "../interfaces/QuoteDialog.i";
import { openSnackbar } from "../../../utils/Notifier";

/**
 * TODO
 * [x] Fix autocomplete fields
 * [ ] Check validation for all other forms
 * [ ] Add extra env variables to AWS (orderlambda)
 * [x] Fix auth errors with send query
 * [x] Give request quote loading UI spinner
 */

// create the initial state with empty input values for when the component mounts
const initialState: QuoteDialogState = {
  email: "",
  sponge: "",
  buttercream: "",
  name: "",
  size: "",
  drip: "",
  requests: "",
  jam: "",
  toppings: "",
  isSubmitting: false,
  errors: {
    email: "",
    sponge: "",
    buttercream: "",
    phoneNumber: "",
    size: "",
    drip: "",
    requests: "",
    jam: "",
    toppings: "",
  },
};

/**
 * Functional component containing a Dialog which will be opened and closed
 * based on the open prop. The component allows the current authenticated user
 * to request a quote for a cake, by filling out the form and adding their
 * chosen requests. The quote will be sent to the company's email, where the
 * quote will be processed and returned, allowing the user to complete their
 * purchase.
 * @param open - boolean value to determine if the dialog should be visible
 * or not
 * @param onClose - function to close the dialog from inside the parent
 * @param cake - the name of the cake which was being viewed when clicking
 * the FAB to request a quote.
 */
const QuoteDialog: React.FC<QuoteDialogProps> = ({ open, onClose, cake }) => {
  // create breakpoints for the useMediaQuery hook
  const breakpoints = createBreakpoints({});
  // store the boolean value to check if the screen width is larger/smaller than xs
  const isMobile = useMediaQuery(breakpoints.down("xs"));
  // initialise state to be initial state when mounting.
  const [state, setState] = useState<QuoteDialogState>(initialState);
  // destructure relevant state
  const {
    email,
    errors,
    sponge,
    buttercream,
    size,
    name,
    drip,
    requests,
    jam,
    toppings,
    isSubmitting,
  } = state;

  /**
   * Function to send a quote (based on the users' input values on the quote
   * form) to the company email, where it can be processed and returned for
   * payment. The email is sent to the company via the orderlambda lambda
   * function.
   */
  const handleRequestQuote = async (): Promise<void> => {
    /**
     * set isSubmitting to true to show a loading spinner while the lambda function
     * is being executed
     */
    setState({
      ...state,
      isSubmitting: true,
    });

    const { username } = await Auth.currentUserInfo();

    // execute the lambda function with the cake parameters and user details passed as parameters
    const res = await API.post("orderlambda", "/orders/send-quote-email", {
      body: {
        user: {
          username,
          email,
          name,
        },
        params: {
          sponge,
          size,
          buttercream,
          drip,
          jam,
          toppings,
          requests,
          cake,
        },
      },
    });
    // if res isn't true, then there's been an error, so notify the user
    if (res !== true) {
      openSnackbar({
        severity: "warning",
        message: "Unable to sent quote. Please try again.",
      });
    } else {
      // if res is true, then close the dialog as operations are complete.
      openSnackbar({
        severity: "success",
        message: "Quote request successfully sent.",
      });
      onClose();
    }
    // stop the UI loading effects showing by setting isSubmitting to false
    setState({
      ...state,
      isSubmitting: false,
    });
  };

  /**
   * Function to validate the QuoteDialogs form before it is sent to the company.
   * It will not allow empty or too small inputs, and any email address sent must
   * be a valid email. If any errors are found, they will be updated in state and
   * then shown to the user via it's helperText prop. All errors will be shown as
   * an error by displaying red text.
   */
  const handleValidateQuote = (): void => {
    // store errors into its own variable so it can be mutated
    const updatedErrors = errors;
    // set original anyErrors boolean to false so it can be changed if any errors exist
    let anyErrors = false;
    // check if email is valid, and that it's a valid length
    if (!isEmail(email) || email.length < 4) {
      updatedErrors.email = "Please enter a valid email address";
      anyErrors = true;
    }
    // check to see if any value exists
    if (sponge.length === 0) {
      updatedErrors.sponge = "Please pick your sponge flavour";
      anyErrors = true;
    }
    // check to see if any value exists
    if (buttercream.length === 0) {
      updatedErrors.buttercream = "Please pick a buttercream flavour";
      anyErrors = true;
    }
    // check to see if the value is valid
    if (name.length < 2) {
      updatedErrors.name = "Please enter a valid name";
      anyErrors = true;
    }
    // check to see if the value is valid
    if (size === "") {
      updatedErrors.size = "Please choose a cake size";
      anyErrors = true;
    }
    // check to see if the value is valid
    if (drip.length === 0) {
      updatedErrors.drip = "Please choose your ganache drip flavour";
      anyErrors = true;
    }
    // check to see if the value is valid
    if (jam.length === 0) {
      updatedErrors.jam = "Please enter your choice of jam";
      anyErrors = true;
    }
    // if there are any values, update it in state to show to the user
    if (anyErrors) {
      return setState({
        ...state,
        errors: updatedErrors,
      });
    }
    // if no errors, request the quote
    handleRequestQuote();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="body"
      fullScreen={isMobile}
      disableBackdropClick
    >
      <DialogTitle>Request a Quote</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please fill in the form with all of the requirements for your cake. All of the
          auto-complete values are items that are accepted, but please feel free to
          request other items, and we will try and facilitate them.
        </DialogContentText>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            {/* Render input that allows user to enter their name */}
            <TextField
              variant="outlined"
              value={name}
              label="Name"
              fullWidth
              placeholder="Enter your name"
              onChange={(e): void =>
                setState({
                  ...state,
                  name: e.target.value,
                  // remove any errors on that name value of errors object by clearing value
                  errors: { ...state.errors, name: "" },
                })
              }
              // only show errors if there is a value in errors.name
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* Render an input that allows the user to input their email address */}
            <TextField
              variant="outlined"
              value={email}
              label="Email Address"
              fullWidth
              placeholder="Enter your email address"
              onChange={(e): void =>
                setState({
                  ...state,
                  email: e.target.value,
                  // remove any errors if they exist when updating
                  errors: { ...state.errors, email: "" },
                })
              }
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={7}>
            {/* Render an auto-complete TextField that allows the user to choose their sponge */}
            <Autocomplete
              options={spongesArr}
              fullWidth
              freeSolo
              inputValue={sponge}
              value={sponge}
              // control the input change and set state when it changes text
              onInputChange={(_e, newValue: string | null): void =>
                setState({
                  ...state,
                  sponge: newValue!,
                  errors: { ...state.errors, sponge: "" },
                })
              }
              // control the input change when the user clicks an auto-complete field.
              onChange={(_e, newValue: string | null): void =>
                setState({
                  ...state,
                  sponge: newValue!,
                  errors: { ...state.errors, sponge: "" },
                })
              }
              // render the TextField to show to the user
              renderInput={(params): JSX.Element => (
                <TextField
                  {...params}
                  label="Sponge"
                  placeholder="Pick the flavour of your sponge"
                  variant="outlined"
                  error={!!errors.sponge}
                  helperText={errors.sponge}
                />
              )}
            />
          </Grid>
          <Grid item xs={5}>
            {/* Render a Select component so the user can choose the size of their cake */}
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Cake Size</InputLabel>
              <Select
                variant="outlined"
                fullWidth
                value={size}
                onChange={(e): void =>
                  setState({ ...state, size: e.target.value as CakeSize })
                }
                label="Cake Size"
              >
                {/* create all MenuItem's for use inside the Select input */}
                <MenuItem value="15cm">Medium (15cm)</MenuItem>
                <MenuItem value="20cm">Large (20cm)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            {/* Render an auto-complete TextField to allow the user to choose their buttercream */}
            <Autocomplete
              options={buttercreamArr}
              fullWidth
              value={buttercream}
              inputValue={buttercream}
              // control the auto-complete value changes
              onChange={(_e, newValue: string | null): void =>
                setState({
                  ...state,
                  buttercream: newValue!,
                  errors: { ...state.errors, buttercream: "" },
                })
              }
              // control text input changes
              onInputChange={(_e, newValue: string | null): void =>
                setState({
                  ...state,
                  buttercream: newValue!,
                  errors: { ...state.errors, buttercream: "" },
                })
              }
              freeSolo
              // render TextField component for user to input values
              renderInput={(params): JSX.Element => (
                <TextField
                  {...params}
                  label="Buttercream"
                  placeholder="Pick the flavour of the buttercream filling"
                  variant="outlined"
                  error={!!errors.buttercream}
                  helperText={errors.buttercream}
                />
              )}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            {/* Render an auto-complete TextField to allow the user to choose their ganache drip */}
            <Autocomplete
              options={dripArr}
              fullWidth
              value={drip}
              inputValue={drip}
              // control auto-complete fields
              onChange={(_e, newValue: string | null): void =>
                setState({
                  ...state,
                  drip: newValue!,
                  errors: { ...state.errors, drip: "" },
                })
              }
              // control user input values on TextField
              onInputChange={(_e, newValue: string | null): void =>
                setState({
                  ...state,
                  drip: newValue!,
                  errors: { ...state.errors, drip: "" },
                })
              }
              freeSolo
              // render TextField for user to input values into.
              renderInput={(params): JSX.Element => (
                <TextField
                  {...params}
                  label="Ganache Drip"
                  placeholder="Pick the flavour of your ganache drip"
                  variant="outlined"
                  error={!!errors.drip}
                  helperText={errors.drip}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            {/* Render an auto-complete TextField to allow the user to choose their jam */}
            <Autocomplete
              options={jamArr}
              fullWidth
              value={jam}
              inputValue={jam}
              // control auto-complete values
              onChange={(_e, newValue: string | null): void =>
                setState({
                  ...state,
                  jam: newValue!,
                  errors: { ...state.errors, jam: "" },
                })
              }
              // control user inputted values from TextField
              onInputChange={(_e, newValue: string | null): void =>
                setState({
                  ...state,
                  jam: newValue!,
                  errors: { ...state.errors, jam: "" },
                })
              }
              freeSolo
              // render TextField for user to input values
              renderInput={(params): JSX.Element => (
                <TextField
                  {...params}
                  label="Jam"
                  placeholder="Pick the flavour of jam"
                  variant="outlined"
                  error={!!errors.jam}
                  helperText={errors.jam}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            {/* Render a multiline TextField for user to input their chosen toppings for the cake */}
            <TextField
              multiline
              rows={2}
              rowsMax={4}
              value={toppings}
              label="Toppings"
              placeholder="Please enter your chosen toppings"
              onChange={(e): void =>
                setState({
                  ...state,
                  toppings: e.target.value,
                  errors: { ...state.errors, toppings: "" },
                })
              }
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            {/* Render a multiline TextField for user to input their chosen bespoke requests */}
            <TextField
              multiline
              rows={2}
              rowsMax={4}
              value={requests}
              label="Bespoke Requests"
              placeholder="Please enter any additional bespoke requests"
              onChange={(e): void =>
                setState({
                  ...state,
                  requests: e.target.value,
                })
              }
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      {/* Render action buttons */}
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button color="primary" onClick={handleValidateQuote}>
          {isSubmitting ? (
            <CircularProgress size={20} color="primary" />
          ) : (
            "Request Quote"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuoteDialog;
