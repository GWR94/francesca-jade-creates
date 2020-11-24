import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  useMediaQuery,
  Grid,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  InputLabel,
  MenuItem,
  Select,
  Button,
  DialogActions,
} from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { Autocomplete } from "@material-ui/lab";
import { spongesArr, buttercreamArr, dripArr } from "../../../utils/data";
import { SearchType } from "../interfaces/ProductList.i";

interface QuoteDialogState {
  email: string;
  phoneNumber: string;
  sponge: string;
  buttercream: string;
  drip: string;
  size: CakeSize;
  requests: string;
  errors: {
    [key: string]: string;
  };
}

type CakeSize = "15cm" | "20cm" | "";

interface QuoteDialogProps {
  open: boolean;
  onClose: () => void;
}

const QuoteDialog: React.FC<QuoteDialogProps> = ({ open, onClose }) => {
  const breakpoints = createBreakpoints({});
  const mobile = useMediaQuery(breakpoints.down("xs"));
  const [state, setState] = useState<QuoteDialogState>({
    email: "",
    sponge: "",
    buttercream: "",
    phoneNumber: "",
    size: "",
    drip: "",
    requests: "",
    errors: {
      email: "",
    },
  });
  const { email, errors, sponge, buttercream, size, phoneNumber, drip, requests } = state;

  const handleRequestQuote = () => {
    console.log({
      email,
      sponge,
      buttercream,
      phoneNumber,
      size,
      drip,
      requests,
    });
    onClose();
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
          Please fill in the form with all of the requirements for your cake.
        </DialogContentText>
        <DialogContentText>
          Please note: Whilst every effort is made to facilitate your preferences, we
          cannot guarantee that every request is fulfillable
        </DialogContentText>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              value={email}
              label="Email Address"
              fullWidth
              placeholder="Enter your email address to receive your quote"
              onChange={(e): void => setState({ ...state, email: e.target.value })}
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
              onChange={(e): void => setState({ ...state, phoneNumber: e.target.value })}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
            />
          </Grid>
          <Grid item xs={7} sm={8}>
            <Autocomplete
              options={spongesArr}
              fullWidth
              freeSolo
              renderInput={(params): JSX.Element => (
                <TextField
                  {...params}
                  label="Sponge"
                  placeholder="Pick the flavour of your sponge"
                  variant="outlined"
                  value={sponge}
                  onChange={(e): void => setState({ ...state, sponge: e.target.value })}
                  error={!!errors.sponge}
                  helperText={errors.sponge}
                />
              )}
            />
          </Grid>
          <Grid item xs={5} sm={4}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Cake Size</InputLabel>
              <Select
                variant="outlined"
                value={size}
                onChange={(e): void =>
                  setState({ ...state, size: e.target.value as CakeSize })
                }
                fullWidth
                label="Cake Size"
              >
                {/* create all MenuItem's for use inside the Select input */}
                <MenuItem value="15cm">Medium (15cm)</MenuItem>
                <MenuItem value="20cm">Large (20cm)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              options={buttercreamArr}
              fullWidth
              freeSolo
              renderInput={(params): JSX.Element => (
                <TextField
                  {...params}
                  label="Buttercream"
                  placeholder="Pick the flavour of the buttercream filling"
                  variant="outlined"
                  value={buttercream}
                  onChange={(e): void =>
                    setState({ ...state, buttercream: e.target.value })
                  }
                  error={!!errors.sponge}
                  helperText={errors.sponge}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              options={dripArr}
              fullWidth
              freeSolo
              renderInput={(params): JSX.Element => (
                <TextField
                  {...params}
                  label="Ganache Drip"
                  placeholder="Pick the flavour of your ganache drip"
                  variant="outlined"
                  value={drip}
                  onChange={(e): void => setState({ ...state, drip: e.target.value })}
                  error={!!errors.sponge}
                  helperText={errors.sponge}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              rows={3}
              rowsMax={5}
              value={requests}
              label="Extra Bespoke Requests"
              placeholder="Please enter any additional bespoke requests"
              onChange={(e): void => setState({ ...state, requests: e.target.value })}
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
        <Button color="primary" onClick={handleRequestQuote}>
          Request Quote
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuoteDialog;
