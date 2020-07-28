import UserActionTypes, { SET_USER, CLEAR_USER } from "../interfaces/user.redux.i";

const defaultUserState = {
  id: null,
  username: null,
};

export interface UserState {
  id: string | null;
  username: string | null;
}

export default (state = defaultUserState, action: UserActionTypes): UserState => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        id: action.id,
        username: action.username,
      };
    case CLEAR_USER:
      return defaultUserState;
    default:
      return state;
  }
};
