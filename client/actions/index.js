
export const ADD_BOOKMARK = 'ADD_BOOKMARK';
export const DELETE_BOOKMARK = 'DELETE_BOOKMARK';
export const UPDATE_BOOKMARK = 'UPDATE_BOOKMARK';

export function addBookmark(bookmark) {
  return {type: ADD_BOOKMARK, bookmark};
}

export function deleteBookmark(id) {
  return {type: DELETE_BOOKMARK, id};
}

export function updateBookmark(id, bookmark) {
  return {type: UPDATE_BOOKMARK, id, bookmark};
}
