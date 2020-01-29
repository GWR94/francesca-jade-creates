import { UserAttributeProps } from "./Accounts.i";

export interface RouterState {
  user: any;
  admin: boolean;
  userAttributes: UserAttributeProps;
  isLoading: boolean;
  show: "profile" | "products" | "create" | "orders";
}
