import UserActionTypes, {
  SET_USER,
  CLEAR_USER,
  CurrentTabTypes,
  SET_CURRENT_TAB,
} from "../interfaces/user.redux.i";

const defaultUserState: UserState = {
  id: null,
  currentTab: "profile",
  admin: false,
};

export interface UserState {
  id: string | null;
  admin: boolean;
  currentTab: CurrentTabTypes;
}

export default (state = defaultUserState, action: UserActionTypes): UserState => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        id: action.id,
        admin: action.admin,
      };
    case CLEAR_USER:
      return defaultUserState;
    case SET_CURRENT_TAB:
      return {
        ...state,
        currentTab: action.tab,
      };
    default:
      return state;
  }
};
