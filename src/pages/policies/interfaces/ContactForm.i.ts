export interface ContactState {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  isSubmitting: boolean;
  errors: {
    firstName: string;
    email: string;
    message: string;
  };
}
