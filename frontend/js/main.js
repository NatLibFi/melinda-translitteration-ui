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
import { loadRecord, setRecord } from './action-creators/record-actions';
import configureStore from './configure-store';
import { isMelindaId, isImportedRecordId } from './utils';

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

  const recordId = parseRecordId(location.pathname);
  
  if (isMelindaId(recordId)) {
    store.dispatch(loadRecord(recordId));
  } else if (isImportedRecordId(recordId)) {
    const record = store.getState().getIn(['importedRecords', recordId, 'record']);

    if (record !== undefined) {
      store.dispatch(setRecord(recordId, record));  
    }
  } else {
    store.dispatch(resetWorkspace());
  }
});

function parseRecordId(path) {
  const [, recordId] = path.match(/\/([a-z0-9-]*)/);
  return recordId;
}
