import {
  CurrentTabTypes,
  SetCurrentTabAction,
  SET_CURRENT_TAB,
  SetUserAction,
  SET_USER,
  ClearUserAction,
  CLEAR_USER,
} from "../interfaces/user.redux.i";

export const setUser = (id: string, admin: boolean): SetUserAction => ({
  type: SET_USER,
  id,
  admin,
});

export const clearUser = (): ClearUserAction => ({
  type: CLEAR_USER,
});

export const setCurrentTab = (tab: CurrentTabTypes): SetCurrentTabAction => ({
  type: SET_CURRENT_TAB,
  tab,
});
