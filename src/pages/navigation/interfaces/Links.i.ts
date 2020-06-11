import {
  UserAttributeProps,
  AccountTabTypes,
} from "../../accounts/interfaces/Accounts.i";

export interface LinksProps {
  mobile?: boolean;
  admin: boolean;
  closeNav: () => void;
  user: UserAttributeProps | null;
  setAccountsTab: (value: AccountTabTypes) => void;
  signOut: () => void;
}
