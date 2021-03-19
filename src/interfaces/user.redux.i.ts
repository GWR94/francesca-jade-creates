export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";
export const SET_CURRENT_TAB = "SET_CURRENT_TAB";
export interface SetUserAction {
  type: typeof SET_USER;
  id: string;
  admin: boolean;
}

export interface ClearUserAction {
  type: typeof CLEAR_USER;
}

export interface SetCurrentTabAction {
  type: typeof SET_CURRENT_TAB;
  tab: CurrentTabTypes;
}

export type CurrentTabTypes =
  | "profile"
  | "create"
  | "products"
  | "orders"
  | "adminOrders";

export interface UserProps {
  id: string;
}

declare type UserActionTypes = SetUserAction | ClearUserAction | SetCurrentTabAction;

// eslint-disable-next-line no-undef
export { UserActionTypes as default };
