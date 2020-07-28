import {
  SetUserAction,
  SET_USER,
  ClearUserAction,
  CLEAR_USER,
} from "../interfaces/user.redux.i";

export const setUser = (id: string, username: string): SetUserAction => ({
  type: SET_USER,
  id,
  username,
});

export const clearUser = (): ClearUserAction => ({
  type: CLEAR_USER,
});
