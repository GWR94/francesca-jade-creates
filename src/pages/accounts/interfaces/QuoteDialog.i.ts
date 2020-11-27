export interface QuoteDialogState {
  email: string;
  phoneNumber: string;
  sponge: string;
  buttercream: string;
  drip: string;
  jam: string;
  size: CakeSize;
  requests: string;
  toppings: string;
  errors: {
    [key: string]: string;
  };
}

export type CakeSize = "15cm" | "20cm" | "";

export interface QuoteDialogProps {
  open: boolean;
  onClose: () => void;
  cake: string;
}
