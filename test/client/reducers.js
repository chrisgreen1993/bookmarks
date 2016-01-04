import Immutable from 'immutable';
import chai, {expect} from 'chai';
import chaiImmutable from 'chai-immutable';
import user from '../../src/client/reducers/user';
import bookmarks from '../../src/client/reducers/bookmarks';
import * as types from '../../src/client/constants/actionTypes';

chai.use(chaiImmutable);

describe('reducers', () => {
  describe('user', () => {
    it('Should return initial state', () => {
      const state = user(undefined, {});
      const expected = Immutable.fromJS({
        _id: null,
        email: null,
        login_errors: {},
        register_errors: {},
      });
      expect(state).to.equal(expected);
    });
    it('Should do nothing if action not recognised', () => {
      const initialState = user(undefined, {});
      const state = user(undefined, {type: 'HELLO'});
      expect(initialState).to.equal(state);
    });
    it('Should set _id and email when action is REGISTER_USER_SUCCESS', () => {
      const action = {
        type: types.REGISTER_USER_SUCCESS,
        user: {_id: '63534', email: 'email@email.com'},
      };
      const state = user(undefined, action);
      const expected = Immutable.fromJS({
        _id: '63534',
        email: 'email@email.com',
        login_errors: {},
        register_errors: {},
      });
      expect(state).to.equal(expected);
    });
    it('Should set _id and email when action is LOGIN_USER_SUCCESS', () => {
      const action = {
        type: types.LOGIN_USER_SUCCESS,
        user: {_id: '63534', email: 'email@email.com'},
      };
      const state = user(undefined, action);
      const expected = Immutable.fromJS({
        _id: '63534',
        email: 'email@email.com',
        login_errors: {},
        register_errors: {},
      });
      expect(state).to.equal(expected);
    });
    it('Should reset to initial state when action is LOGOUT_USER_SUCCESS', () => {
      const initialState = Immutable.fromJS({
        _id: '7423',
        email: 'email@email.com',
        login_errors: {},
        register_errors: {},
      });
      const action = {type: types.LOGOUT_USER_SUCCESS};
      const state = user(initialState, action);
      const expected = Immutable.fromJS({
        _id: null,
        email: null,
        login_errors: {},
        register_errors: {},
      });
      expect(state).to.equal(expected);
    });
  });
  describe('bookmarks', () => {
    it('Should return initial state', () => {
      const state = bookmarks(undefined, {});
      expect(state).to.equal(Immutable.List());
    });
    it('Should do nothing if action not recognised', () => {
      const state = bookmarks(undefined, {type: 'HELLO'});
      expect(state).to.equal(Immutable.List());
    });
    it('Should add bookmarks to state when action is GET_BOOKMARKS_SUCCESS', () => {
      const action = {
        type: types.GET_BOOKMARKS_SUCCESS,
        bookmarks: [
          {_id: '12233', title: 'webpage', url: 'webpage.com', user: '46757'},
          {_id: '12253', title: 'some site', url: 'google.com', user: '46757'},
        ],
      };
      const state = bookmarks(undefined, action);
      const expected = Immutable.fromJS([
        {_id: '12233', title: 'webpage', url: 'webpage.com', user: '46757'},
        {_id: '12253', title: 'some site', url: 'google.com', user: '46757'},
      ]);
      expect(state).to.equal(expected);
    });
    it('State should be empty list if GET_BOOKMARKS_SUCCESS has empty list', () => {
      const action = {
        type: types.GET_BOOKMARKS_SUCCESS,
        bookmarks: [],
      };
      const state = bookmarks(undefined, action);
      expect(state).to.equal(Immutable.List());
    });
    it('Should add a bookmark to state when action is ADD_BOOKMARK_SUCCESS', () => {
      const action = {
        type: types.ADD_BOOKMARK_SUCCESS,
        bookmark: {_id: '12354', title: 'super site', url: 'test.com', user: '6454'},
      };
      const state = bookmarks(undefined, action);
      const expected = Immutable.fromJS([
        {_id: '12354', title: 'super site', url: 'test.com', user: '6454'},
      ]);
      expect(state).to.equal(expected);
    });
    it('Should add a bookmark to start of state when action is ADD_BOOKMARK_SUCCESS', () => {
      const action = {
        type: types.ADD_BOOKMARK_SUCCESS,
        bookmark: {_id: '12354', title: 'super site', url: 'test.com', user: '6454'},
      };
      const initialState = Immutable.fromJS([
        {_id: '12233', title: 'webpage', url: 'webpage.com', user: '6454'},
      ]);
      const state = bookmarks(initialState, action);
      const expected = Immutable.fromJS([
        {_id: '12354', title: 'super site', url: 'test.com', user: '6454'},
        {_id: '12233', title: 'webpage', url: 'webpage.com', user: '6454'},
      ]);
      expect(state).to.equal(expected);
    });
    it('Should update bookmark in state when action is UPDATE_BOOKMARK_SUCCESS', () => {
      const action = {
        type: types.UPDATE_BOOKMARK_SUCCESS,
        bookmark: {_id: '12233', title: 'super site', url: 'webpage.com', user: '6454'},
      };
      const initialState = Immutable.fromJS([
        {_id: '12233', title: 'website', url: 'webpage.com', user: '6454'},
      ]);
      const state = bookmarks(initialState, action);
      const expected = Immutable.fromJS([
        {_id: '12233', title: 'super site', url: 'webpage.com', user: '6454'},
      ]);
      expect(state).to.equal(expected);
    });
    it('Should delete bookmark from state when action is DELETE_BOOKMARK_SUCCESS', () => {
      const action = {
        type: types.DELETE_BOOKMARK_SUCCESS,
        id: '12253',
      };
      const initialState = Immutable.fromJS([
        {_id: '12233', title: 'website', url: 'webpage.com', user: '6454'},
        {_id: '12253', title: 'supercool', url: 'website.com', user: '6454'},
      ]);
      const state = bookmarks(initialState, action);
      const expected = Immutable.fromJS([
        {_id: '12233', title: 'website', url: 'webpage.com', user: '6454'},
      ]);
      expect(state).to.equal(expected);
    });
  });
});
