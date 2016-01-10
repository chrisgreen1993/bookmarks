import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import * as types from '../../src/client/constants/actionTypes';
import {loginUser, logoutUser, registerUser} from '../../src/client/actions/user';
import {getBookmarks, getBookmark, addBookmark, deleteBookmark, updateBookmark} from '../../src/client/actions/bookmarks';


describe('actions', () => {
  let mockStore;
  before(() => {
    mockStore = configureMockStore([thunk]);
  });
  afterEach(() => nock.cleanAll());
  describe('user', () => {
    it('#loginUser should dispatch LOGIN_USER and LOGIN_USER_FAIL actions when login fails', done => {
      const email = 'email@email.com';
      const password = 'incorrect';
      nock('http://localhost')
        .post('/api/users/login', {email, password})
        .reply(401, {message: 'Login failed', errors: [{field: 'password', message: 'Incorrect Password'}]});
      const expectedActions = [
        {type: types.LOGIN_USER},
        {type: types.LOGIN_USER_FAIL, error: {message: 'Login failed', errors: [{field: 'password', message: 'Incorrect Password'}]}},
      ];
      const store = mockStore({}, expectedActions, done);
      store.dispatch(loginUser(email, password));
    });
    it('#loginUser should dispatch LOGIN_USER and LOGIN_USER_SUCCESS actions when login succeeds', done => {
      const email = 'email@email.com';
      const password = 'correct';
      nock('http://localhost')
        .post('/api/users/login', {email, password})
        .reply(200, {_id: '45632', email});
      const expectedActions = [
        {type: types.LOGIN_USER},
        {type: types.LOGIN_USER_SUCCESS, user: {_id: '45632', email: 'email@email.com'}},
      ];
      const store = mockStore({}, expectedActions, done);
      store.dispatch(loginUser(email, password));
    });
    it('#logoutUser should dispatch LOGOUT_USER and LOGOUT_USER_FAIL actions when logout fails', done => {
      nock('http://localhost')
        .post('/api/users/logout')
        .reply(401, {message: 'Unauthorized'});
      const expectedActions = [
        {type: types.LOGOUT_USER},
        {type: types.LOGOUT_USER_FAIL, error: {message: 'Unauthorized'}},
      ];
      const store = mockStore({}, expectedActions, done);
      store.dispatch(logoutUser());
    });
    it('#logoutUser should dispatch LOGOUT_USER and LOGOUT_USER_SUCCESS actions when logout succeeds', done => {
      nock('http://localhost')
        .post('/api/users/logout')
        .reply(204);
      const expectedActions = [
        {type: types.LOGOUT_USER},
        {type: types.LOGOUT_USER_SUCCESS},
      ];
      const store = mockStore({}, expectedActions, done);
      store.dispatch(logoutUser());
    });
    it('#registerUser should dispatch REGISTER_USER and REGISTER_USER_FAIL actions when registration fails', done => {
      const email = 'emailemail.com';
      const password = 'password';
      nock('http://localhost')
        .post('/api/users', {email, password})
        .reply(400, {
          message: 'User validation failed',
          errors: [{field: 'email', message: 'Invalid Email'}],
        });
      const expectedActions = [
        {type: types.REGISTER_USER},
        {type: types.REGISTER_USER_FAIL, error: {
          message: 'User validation failed',
          errors: [{field: 'email', message: 'Invalid Email'}],
        }},
      ];
      const store = mockStore({}, expectedActions, done);
      store.dispatch(registerUser(email, password));
    });
    it('#registerUser should dispatch REGISTER_USER and REGISTER_USER_SUCCESS actions when registration succeeds', done => {
      const email = 'email@email.com';
      const password = 'password';
      nock('http://localhost')
        .post('/api/users', {email, password})
        .reply(200, {_id: '23455', email: 'email@email.com'});
      const expectedActions = [
        {type: types.REGISTER_USER},
        {type: types.REGISTER_USER_SUCCESS, user: {_id: '23455', email: 'email@email.com'}},
      ];
      const store = mockStore({}, expectedActions, done);
      store.dispatch(registerUser(email, password));
    });
  });
  describe('bookmarks', () => {
    it('#getBookmarks should dispatch GET_BOOKMARKS and GET_BOOKMARKS_FAIL actions when fetching bookmarks fails', done => {
      nock('http://localhost')
        .get('/api/bookmarks')
        .reply(500, {message: 'Internal Server Error'});
      const expectedActions = [
        {type: types.GET_BOOKMARKS},
        {type: types.GET_BOOKMARKS_FAIL, error: {message: 'Internal Server Error'}},
      ];
      const store = mockStore({}, expectedActions, done);
      store.dispatch(getBookmarks());
    });
    it('#getBookmarks should dispatch GET_BOOKMARKS and GET_BOOKMARKS_SUCCESS actions when fetching bookmarks succeeds', done => {
      nock('http://localhost')
        .get('/api/bookmarks')
        .reply(200, [
          {
            _id: '12233',
            title: 'webpage',
            url: 'webpage.com',
            user: '46757',
          },
          {
            _id: '12253',
            title: 'some site',
            url: 'google.com',
            user: '46757',
          },
        ]);
      const expectedActions = [
        {type: types.GET_BOOKMARKS},
        {type: types.GET_BOOKMARKS_SUCCESS, bookmarks: [
          {
            _id: '12233',
            title: 'webpage',
            url: 'webpage.com',
            user: '46757',
          },
          {
            _id: '12253',
            title: 'some site',
            url: 'google.com',
            user: '46757',
          },
        ]},
      ];
      const store = mockStore({}, expectedActions, done);
      store.dispatch(getBookmarks());
    });
    it('#getBookmark should dispatch GET_BOOKMARK and GET_BOOKMARK_FAIL actions when fetching a bookmark fails', done => {
      nock('http://localhost')
        .get('/api/bookmarks/123')
        .reply(404, {message: 'Not Found'});
      const expectedActions = [
        {type: types.GET_BOOKMARK},
        {type: types.GET_BOOKMARK_FAIL, error: {message: 'Not Found'}},
      ];
      const store = mockStore({}, expectedActions, done);
      store.dispatch(getBookmark(123));
    });
    it('#getBookmark should dispatch GET_BOOKMARK and GET_BOOKMARK_SUCCESS actions when fetching a bookmark succeeds', done => {
      nock('http://localhost')
        .get('/api/bookmarks/1234')
        .reply(200, {_id: '1234', title: 'super cool site', url: 'google.com', user: '1236'});
      const expectedActions = [
        {type: types.GET_BOOKMARK},
        {type: types.GET_BOOKMARK_SUCCESS, bookmark: {
          _id: '1234', title: 'super cool site', url: 'google.com', user: '1236',
        }},
      ];
      const store = mockStore({}, expectedActions, done);
      store.dispatch(getBookmark(1234));
    });
    it('#addBookmark should dispatch ADD_BOOKMARK and ADD_BOOKMARK_FAIL actions when adding a bookmark fails', done => {
      const title = 'bookmark';
      const url = 'Invalid';
      nock('http://localhost')
        .post('/api/bookmarks', {title, url})
        .reply(400, {message: 'Bookmark validation failed', errors: [{field: 'url', message: 'Invalid URL'}]});
      const expectedActions = [
        {type: types.ADD_BOOKMARK},
        {type: types.ADD_BOOKMARK_FAIL, error: {message: 'Bookmark validation failed', errors: [{field: 'url', message: 'Invalid URL'}]}},
      ];
      const store = mockStore({}, expectedActions, done);
      store.dispatch(addBookmark(title, url));
    });
    it('#addBookmark should dispatch ADD_BOOKMARK and ADD_BOOKMARK_SUCCESS actions when adding a bookmark succeeds', done => {
      const title = 'bookmark';
      const url = 'somesite.com';
      nock('http://localhost')
        .post('/api/bookmarks', {title, url})
        .reply(200, {_id: '2243232', title: 'bookmark', url: 'somesite.com', user: '2344'});
      const expectedActions = [
        {type: types.ADD_BOOKMARK},
        {type: types.ADD_BOOKMARK_SUCCESS, bookmark: {
          _id: '2243232', title: 'bookmark', url: 'somesite.com', user: '2344',
        }},
      ];
      const store = mockStore({}, expectedActions, done);
      store.dispatch(addBookmark(title, url));
    });
    it('#deleteBookmark should dispatch DELETE_BOOKMARK and DELETE_BOOKMARK_FAIL actions when deleting a bookmark fails', done => {
      nock('http://localhost')
        .delete('/api/bookmarks/123')
        .reply(404, {message: 'Not Found'});
      const expectedActions = [
        {type: types.DELETE_BOOKMARK},
        {type: types.DELETE_BOOKMARK_FAIL, error: {message: 'Not Found'}},
      ];
      const store = mockStore({}, expectedActions, done);
      store.dispatch(deleteBookmark(123));
    });
    it('#deleteBookmark should dispatch DELETE_BOOKMARK and DELETE_BOOKMARK_SUCCESS actions when deleting a bookmark succeeds', done => {
      nock('http://localhost')
        .delete('/api/bookmarks/123')
        .reply(204);
      const expectedActions = [
        {type: types.DELETE_BOOKMARK},
        {type: types.DELETE_BOOKMARK_SUCCESS, id: 123},
      ];
      const store = mockStore({}, expectedActions, done);
      store.dispatch(deleteBookmark(123));
    });
    it('#updateBookmark should dispatch UPDATE_BOOKMARK and UPDATE_BOOKMARK_FAIL actions when updating a bookmark fails', done => {
      const title = 'hello';
      const url = 'website.com';
      nock('http://localhost')
        .put('/api/bookmarks/123', {title, url})
        .reply(404, {message: 'Not Found'});
      const expectedActions = [
        {type: types.UPDATE_BOOKMARK},
        {type: types.UPDATE_BOOKMARK_FAIL, error: {message: 'Not Found'}},
      ];
      const store = mockStore({}, expectedActions, done);
      store.dispatch(updateBookmark(123, title, url));
    });
    it('#updateBookmark should dispatch UPDATE_BOOKMARK and UPDATE_BOOKMARK_SUCCESS actions when updating a bookmark succeeds', done => {
      const title = 'hello';
      const url = 'website.com';
      nock('http://localhost')
        .put('/api/bookmarks/123', {title, url})
        .reply(200, {_id: '123', title: 'hello', url: 'website.com', user: '7765'});
      const expectedActions = [
        {type: types.UPDATE_BOOKMARK},
        {type: types.UPDATE_BOOKMARK_SUCCESS, bookmark: {_id: '123', title: 'hello', url: 'website.com', user: '7765'}},
      ];
      const store = mockStore({}, expectedActions, done);
      store.dispatch(updateBookmark(123, title, url));
    });
  });
});
