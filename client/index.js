import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute} from 'react-router';
import {createHistory} from 'history';
import configureStore from './store/configureStore';
import App from './containers/App';
import Bookmarks from './containers/Bookmarks';
import Register from './containers/Register';
import Login from './containers/Login';
import NotFound from './containers/NotFound';

const store = configureStore();

render(
  <Provider store={store}>
    <Router history={createHistory()}>
      <Route path="/" component={App}>
        <IndexRoute component={Bookmarks} />
        <Route path="register" component={Register} />
        <Route path="login" component={Login} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
