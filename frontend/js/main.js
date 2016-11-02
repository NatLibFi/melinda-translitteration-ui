import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BaseComponentContainer } from './components/base-component';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './root-reducer';
import {Provider} from 'react-redux';
import App from './components/app';
import * as Cookies from 'js-cookie';
import { validateSession } from 'commons/action-creators/session-actions';
import { resetWorkspace } from 'commons/action-creators/ui-actions';

import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import { routerMiddleware } from 'react-router-redux';
import { loadRecord } from './action-creators/record-actions';

const loggerMiddleware = createLogger();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware,
      routerMiddleware(browserHistory)
    )
  )
);

const routes = (
  <Route component={App}>
    <Route path='/' component={BaseComponentContainer} />
    <Route path='/:id' component={BaseComponentContainer} />
  </Route>
);

const rootElement = document.getElementById('app');

const history = syncHistoryWithStore(browserHistory, store, {selectLocationState: (state) => state.get('routing') });

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>{routes}</Router>
  </Provider>, 
  rootElement
);

const sessionToken = Cookies.get('sessionToken');

store.dispatch(validateSession(sessionToken));

history.listen(location => {

  const [, recordId] = location.pathname.match(/\/(\d*)/);
  
  if (recordId) {
    store.dispatch(loadRecord(recordId));
  } else {
    store.dispatch(resetWorkspace());
  }
});
