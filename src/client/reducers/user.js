import Immutable from 'immutable';
import {LOGIN_USER, REGISTER_USER} from '../actions/user';

const initialState = Immutable.Map({});

function user(state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER:
      return state;
    case REGISTER_USER:
      return state;
    default:
      return state;
  }
}

export default user;
