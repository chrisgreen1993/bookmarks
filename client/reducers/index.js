import {combineReducers} from 'redux';

function bookmarks(state = [], action) {
  return state;
}

const rootReducer = combineReducers({bookmarks});

export default rootReducer;
