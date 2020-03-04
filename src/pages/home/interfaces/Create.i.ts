export interface CreateProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CreateState {
  username: {
    value: string;
    error: string;
  };
  password: {
    value: string;
    error: string;
  };
  email: {
    value: string;
    error: string;
  };
  phoneNumber: {
    code: string;
    number: string;
    error: string;
  };
  codeSent: boolean;
  destination: string;
  code: string;
  codeLoading: boolean;
  createLoading: boolean;
}
