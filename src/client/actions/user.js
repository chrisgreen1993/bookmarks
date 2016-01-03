import request from 'superagent';
import * as types from '../constants/actionTypes';

export function loginUser(email, password) {
  return (dispatch) => {
    dispatch({type: types.LOGIN_USER});
    return request.post('/api/users/login')
      .send({email, password})
      .end((err, res) => {
        if (err) return dispatch({type: types.LOGIN_USER_FAIL, error: err.response.body});
        return dispatch({type: types.LOGIN_USER_SUCCESS, user: res.body});
      });
  };
}

export function logoutUser() {
  return (dispatch) => {
    dispatch({type: types.LOGOUT_USER});
    return request.post('/api/users/logout')
      .end(err => {
        if (err) return dispatch({type: types.LOGOUT_USER_FAIL, error: err.response.body});
        return dispatch({type: types.LOGOUT_USER_SUCCESS});
      });
  };
}

export function registerUser(email, password) {
  return (dispatch) => {
    dispatch({type: types.REGISTER_USER});
    return request.post('/api/users')
      .send({email, password})
      .end((err, res) => {
        if (err) return dispatch({type: types.REGISTER_USER_FAIL, error: err.response.body});
        return dispatch({type: types.REGISTER_USER_SUCCESS, user: res.body});
      });
  };
}
