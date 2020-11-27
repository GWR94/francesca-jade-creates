import React, { useState } from "react";
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
} from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { API, Auth } from "aws-amplify";
import { useSelector } from "react-redux";
import { Autocomplete } from "@material-ui/lab";
import {
  spongesArr,
  buttercreamArr,
  dripArr,
  jamArr,
  phoneNumberReg,
} from "../../../utils/data";
import {
  QuoteDialogState,
  QuoteDialogProps,
  CakeSize,
} from "../interfaces/QuoteDialog.i";
import { AppState } from "../../../store/store";

/**
 * TODO
 * [x] Fix autocomplete fields
 * [ ] Check validation for all other forms
 * [ ] Add extra env variables to AWS (orderlambda)
 * [ ] Fix auth errors with send query
 */

const initialState: QuoteDialogState = {
  email: "",
  sponge: "",
  buttercream: "",
  phoneNumber: "",
  size: "",
  drip: "",
  requests: "",
  jam: "",
  toppings: "",
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

const QuoteDialog: React.FC<QuoteDialogProps> = ({ open, onClose, cake }) => {
  const breakpoints = createBreakpoints({});
  const mobile = useMediaQuery(breakpoints.down("xs"));
  const [state, setState] = useState<QuoteDialogState>(initialState);
  const {
    email,
    errors,
    sponge,
    buttercream,
    size,
    phoneNumber,
    drip,
    requests,
    jam,
    toppings,
  } = state;

  const { username } = useSelector(({ user }: AppState) => user);

  const handleRequestQuote = async (): Promise<void> => {
    const res = await API.post("orderlambda", "/orders/send-quote-email", {
      body: {
        user: {
          username,
          email,
          phoneNumber,
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
    console.log(res);
    onClose();
  };

  const handleValidateQuote = (): void => {
    const updatedErrors = errors;
    let anyErrors = false;
    if (!isEmail(email) || email.length < 4) {
      updatedErrors.email = "Please enter a valid email address";
      anyErrors = true;
    }
    if (sponge.length === 0) {
      updatedErrors.sponge = "Please pick your sponge flavour";
      anyErrors = true;
    }
    if (buttercream.length === 0) {
      updatedErrors.buttercream = "Please pick a buttercream flavour";
      anyErrors = true;
    }
    if (phoneNumber.length > 1 && !phoneNumber.match(phoneNumberReg)) {
      updatedErrors.phoneNumber = "Please enter a valid phone number";
      anyErrors = true;
    }
    if (size === "") {
      updatedErrors.size = "Please choose a cake size";
      anyErrors = true;
    }
    if (drip.length === 0) {
      updatedErrors.drip = "Please choose your ganache drip flavour";
      anyErrors = true;
    }
    if (jam.length === 0) {
      updatedErrors.jam = "Please enter your choice of jam";
      anyErrors = true;
    }
    console.log(updatedErrors);
    if (anyErrors) {
      return setState({
        ...state,
        errors: updatedErrors,
      });
    }
    handleRequestQuote();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="body"
      fullScreen={mobile}
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
            <TextField
              variant="outlined"
              value={email}
              label="Email Address"
              fullWidth
              placeholder="Enter your email address to receive your quote"
              onChange={(e): void =>
                setState({
                  ...state,
                  email: e.target.value,
                  errors: { ...state.errors, email: "" },
                })
              }
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              value={phoneNumber}
              label="Phone Number (optional)"
              fullWidth
              placeholder="Enter your phone number"
              onChange={(e): void =>
                setState({
                  ...state,
                  phoneNumber: e.target.value,
                  errors: { ...state.errors, phoneNumber: "" },
                })
              }
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
            />
          </Grid>
          <Grid item xs={7}>
            <Autocomplete
              options={spongesArr}
              fullWidth
              freeSolo
              inputValue={sponge}
              value={sponge}
              onInputChange={(_e, newValue: string | null): void =>
                setState({
                  ...state,
                  sponge: newValue!,
                  errors: { ...state.errors, sponge: "" },
                })
              }
              onChange={(_e, newValue: string | null): void =>
                setState({
                  ...state,
                  sponge: newValue!,
                  errors: { ...state.errors, sponge: "" },
                })
              }
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
            <Autocomplete
              options={buttercreamArr}
              fullWidth
              value={buttercream}
              inputValue={buttercream}
              onChange={(_e, newValue: string | null): void =>
                setState({
                  ...state,
                  buttercream: newValue!,
                  errors: { ...state.errors, buttercream: "" },
                })
              }
              onInputChange={(_e, newValue: string | null): void =>
                setState({
                  ...state,
                  buttercream: newValue!,
                  errors: { ...state.errors, buttercream: "" },
                })
              }
              freeSolo
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
            <Autocomplete
              options={dripArr}
              fullWidth
              value={drip}
              inputValue={drip}
              onChange={(_e, newValue: string | null): void =>
                setState({
                  ...state,
                  drip: newValue!,
                  errors: { ...state.errors, drip: "" },
                })
              }
              onInputChange={(_e, newValue: string | null): void =>
                setState({
                  ...state,
                  drip: newValue!,
                  errors: { ...state.errors, drip: "" },
                })
              }
              freeSolo
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
            <Autocomplete
              options={jamArr}
              fullWidth
              value={jam}
              inputValue={jam}
              onChange={(_e, newValue: string | null): void =>
                setState({
                  ...state,
                  jam: newValue!,
                  errors: { ...state.errors, jam: "" },
                })
              }
              onInputChange={(_e, newValue: string | null): void =>
                setState({
                  ...state,
                  jam: newValue!,
                  errors: { ...state.errors, jam: "" },
                })
              }
              freeSolo
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
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button color="primary" onClick={handleValidateQuote}>
          Request Quote
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuoteDialog;
