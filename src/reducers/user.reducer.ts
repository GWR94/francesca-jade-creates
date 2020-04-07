import UserActionTypes, { SET_USER, CLEAR_USER } from "../interfaces/user.redux.i";

const defaultUserState = {
  id: null,
};

export interface UserState {
  id: string;
}

export default (state = defaultUserState, action: UserActionTypes): UserState => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        id: action.id,
      };
    case CLEAR_USER:
      return defaultUserState;
    default:
      return state;
  }
};
