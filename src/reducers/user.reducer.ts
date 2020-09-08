import UserActionTypes, {
  SET_USER,
  CLEAR_USER,
  CurrentTabTypes,
  SET_CURRENT_TAB,
} from "../interfaces/user.redux.i";

const defaultUserState: UserState = {
  id: null,
  username: null,
  admin: false,
  currentTab: "profile",
  email: null,
  emailVerified: false,
};

export interface UserState {
  id: string | null;
  username: string | null;
  admin: boolean;
  email: string | null;
  emailVerified: boolean;
  currentTab: CurrentTabTypes;
}

export default (state = defaultUserState, action: UserActionTypes): UserState => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        id: action.id,
        username: action.username,
        admin: action.admin,
        email: action.email,
        emailVerified: action.emailVerified,
      };
    case SET_CURRENT_TAB:
      return {
        ...state,
        currentTab: action.currentTab,
      };
    case CLEAR_USER:
      return defaultUserState;
    default:
      return state;
  }
};
