import {createStore} from 'redux';
import rootReducer from '../reducers';

function configureStore(initialState) {
  const store = createStore(rootReducer, initialState);

  if (module.hot) {
    // Hot module reload for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }
  return store;
}

export default configureStore;
