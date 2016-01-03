import {combineReducers} from 'redux';
import bookmarks from './bookmarks';
import user from './user';

const rootReducer = combineReducers({
  bookmarks,
  user,
});

export default rootReducer;
