import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import RootComponent from './components/root-component';
import {Provider} from 'react-redux';
import App from './components/app';
import * as Cookies from 'js-cookie';
import { validateSession } from 'commons/action-creators/session-actions';
import { resetWorkspace } from 'commons/action-creators/ui-actions';

import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { loadRecord } from './action-creators/record-actions';
import configureStore from './configure-store';

const store = configureStore();

const routes = (
  <Route component={App}>
    <Route path='/' component={RootComponent} />
    <Route path='/:id' component={RootComponent} />
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
