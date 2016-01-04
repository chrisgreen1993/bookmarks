import request from 'superagent';
import * as types from '../constants/actionTypes';

export function getBookmarks() {
  return (dispatch) => {
    dispatch({type: types.GET_BOOKMARKS});
    return request.get('/api/bookmarks')
      .end((err, res) => {
        if (err) return dispatch({type: types.GET_BOOKMARKS_FAIL, error: err.response.body});
        return dispatch({type: types.GET_BOOKMARKS_SUCCESS, bookmarks: res.body});
      });
  };
}

export function getBookmark(id) {
  return (dispatch) => {
    dispatch({type: types.GET_BOOKMARK});
    return request.get(`/api/bookmarks/${id}`)
      .end((err, res) => {
        if (err) return dispatch({type: types.GET_BOOKMARK_FAIL, error: err.response.body});
        return dispatch({type: types.GET_BOOKMARK_SUCCESS, bookmark: res.body});
      });
  };
}

export function addBookmark(title, url) {
  return (dispatch) => {
    dispatch({type: types.ADD_BOOKMARK});
    return request.post('/api/bookmarks')
      .send({title, url})
      .end((err, res) => {
        if (err) return dispatch({type: types.ADD_BOOKMARK_FAIL, error: err.response.body});
        return dispatch({type: types.ADD_BOOKMARK_SUCCESS, bookmark: res.body});
      });
  };
}

export function deleteBookmark(id) {
  return (dispatch) => {
    dispatch({type: types.DELETE_BOOKMARK});
    return request.del(`/api/bookmarks/${id}`)
      .end(err => {
        if (err) return dispatch({type: types.DELETE_BOOKMARK_FAIL, error: err.response.body});
        return dispatch({type: types.DELETE_BOOKMARK_SUCCESS, id});
      });
  };
}

export function updateBookmark(id, title, url) {
  return (dispatch) => {
    dispatch({type: types.UPDATE_BOOKMARK});
    return request.put(`/api/bookmarks/${id}`)
      .send({title, url})
      .end((err, res) => {
        if (err) return dispatch({type: types.UPDATE_BOOKMARK_FAIL, error: err.response.body});
        return dispatch({type: types.UPDATE_BOOKMARK_SUCCESS, bookmark: res.body});
      });
  };
}
