import Immutable from 'immutable';
import {ADD_BOOKMARK, UPDATE_BOOKMARK, DELETE_BOOKMARK} from '../actions/bookmarks';

const initialState = Immutable.Map({});

function bookmarks(state = initialState, action) {
  switch (action.type) {
    case ADD_BOOKMARK:
      return state;
    case UPDATE_BOOKMARK:
      return state;
    case DELETE_BOOKMARK:
      return state;
    default:
      return state;
  }
}

export default bookmarks;