import { ProductProps } from "./Product.i";

export interface AccountsState {
  products: ProductProps[];
  isLoading: boolean;
  currentTab: "profile" | "products" | "create" | "orders";
}

export interface AccountsProps {
  user: any;
  admin: boolean;
  userAttributes: UserAttributeProps;
  setAccountsTab: (page) => void;
  accountsTab: "profile" | "products" | "create" | "orders";
}

export interface UserAttributeProps {
  sub?: string;
  email_verified?: boolean;
  phone_number_verified?: boolean;
  phone_number?: string;
  email?: string;
  picture?: string;
}
