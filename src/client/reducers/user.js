import Immutable from 'immutable';
import * as types from '../constants/actionTypes';

const initialState = {
  _id: null,
  email: null,
  login_errors: {},
  register_errors: {},
};

function user(state = Immutable.fromJS(initialState), action) {
  switch (action.type) {
    case types.REGISTER_USER_SUCCESS:
    case types.LOGIN_USER_SUCCESS:
      return state.set('_id', action.user._id).set('email', action.user.email);
    case types.LOGOUT_USER_SUCCESS:
      return Immutable.fromJS(initialState);
    case types.LOGIN_USER_FAIL:
      return state.set('login_errors', Immutable.fromJS(action.error));
    case types.REGISTER_USER_FAIL:
      return state.set('register_errors', Immutable.fromJS(action.error));
    default:
      return state;
  }
}

export default user;
