import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute} from 'react-router';
import {createHistory} from 'history';
import configureStore from './store/configureStore';
import App from './containers/App';
import Bookmarks from './containers/Bookmarks';
import Auth from './containers/Auth';
import Register from './containers/Register';
import Login from './containers/Login';
import NotFound from './components/NotFound';

const store = configureStore();

function requireAuth(nextState, replaceState) {
  // send request instead
  /*
  const state = store.getState();
  if (!state.user._id) {
    replaceState({nextPathname: nextState.location.pathname}, '/login');
  }*/
}

render(
  <Provider store={store}>
    <Router history={createHistory()}>
      <Route path="/">
        <Route component={App}>
          <IndexRoute component={Bookmarks} onEnter={requireAuth} />
        </Route>
        <Route component={Auth}>
          <Route path="register" component={Register} />
          <Route path="login" component={Login} />
        </Route>
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
