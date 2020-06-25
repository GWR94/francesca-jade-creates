import {
  UserAttributeProps,
  CognitoUserProps,
} from "../../pages/accounts/interfaces/Accounts.i";

export interface NavBarProps {
  signOut: () => void;
  setAccountsTab: (tab) => void;
  user: CognitoUserProps;
  userAttributes: UserAttributeProps;
  admin: boolean;
}
