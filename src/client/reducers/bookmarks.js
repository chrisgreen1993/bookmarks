import Immutable from 'immutable';
import * as types from '../constants/actionTypes';

const initialState = [];

function bookmarks(state = Immutable.fromJS(initialState), action) {
  switch (action.type) {
    case types.GET_BOOKMARKS_SUCCESS:
      return Immutable.fromJS(action.bookmarks);
    case types.ADD_BOOKMARK_SUCCESS:
      return state.splice(0, 0, Immutable.fromJS(action.bookmark));
    case types.UPDATE_BOOKMARK_SUCCESS:
      const updateIdx = state.findIndex(bookmark => bookmark.get('_id') === action.bookmark._id);
      return state.set(updateIdx, Immutable.fromJS(action.bookmark));
    case types.DELETE_BOOKMARK_SUCCESS:
      const delIdx = state.findIndex(bookmark => bookmark.get('_id') === action.id);
      return state.delete(delIdx);
    default:
      return state;
  }
}

export default bookmarks;
