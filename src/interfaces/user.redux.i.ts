export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";

export interface SetUserAction {
  type: typeof SET_USER;
  id: string;
  username: string;
}

export interface ClearUserAction {
  type: typeof CLEAR_USER;
}

export interface UserProps {
  id: string;
}

declare type UserActionTypes = SetUserAction | ClearUserAction;

// eslint-disable-next-line no-undef
export { UserActionTypes as default };
