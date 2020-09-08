import {
  SetUserAction,
  SET_USER,
  ClearUserAction,
  CLEAR_USER,
  SET_CURRENT_TAB,
  SetCurrentTabAction,
  CurrentTabTypes,
} from "../interfaces/user.redux.i";

export const setUser = (
  id: string,
  username: string,
  admin: boolean,
  email: string,
  emailVerified: boolean,
): SetUserAction => ({
  type: SET_USER,
  id,
  username,
  admin,
  email,
  emailVerified,
});

export const setCurrentTab = (currentTab: CurrentTabTypes): SetCurrentTabAction => ({
  type: SET_CURRENT_TAB,
  currentTab,
});

export const clearUser = (): ClearUserAction => ({
  type: CLEAR_USER,
});
