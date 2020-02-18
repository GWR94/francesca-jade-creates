import { UsernameAttributes } from "aws-amplify-react/lib-esm/Auth/common/types";
import { UserAttributeProps } from "../pages/accounts/interfaces/Accounts.i";

export interface RouterState {
  user: UsernameAttributes;
  userAttributes: UserAttributeProps;
  isLoading: boolean;
  accountsTab: "profile" | "products" | "create" | "orders";
}
