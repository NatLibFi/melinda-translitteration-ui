/**
*
* @licstart  The following is the entire license notice for the JavaScript code in this file.
*
* UI for transliterating MARC records in Melinda
*
* Copyright (c) 2016-2019 University Of Helsinki (The National Library Of Finland)
*
* This file is part of melinda-cyrillux
*
* melinda-cyrillux program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* melinda-cyrillux is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
* @licend  The above is the entire license notice
* for the JavaScript code in this file.
*
*/
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import RootComponent from './components/root-component';
import {Provider} from 'react-redux';
import App from './components/app';
import * as Cookies from 'js-cookie';
import { validateSession } from 'commons/action-creators/session-actions';
import { resetWorkspace } from 'commons/action-creators/ui-actions';

import { Route } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import { loadRecord, setRecord } from './action-creators/record-actions';
import configureStore from './configure-store';
import { isMelindaId, isImportedRecordId } from './utils';
import history from './history';
import 'material-design-icons-iconfont';

const store = configureStore();

const rootElement = document.getElementById('app');

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App>
        <Route exact path='/' component={RootComponent} />
        <Route exact path='/:id' component={RootComponent} />
      </App>
    </ConnectedRouter>
  </Provider>, 
  rootElement
);

const sessionToken = Cookies.get('sessionToken');

store.dispatch(validateSession(sessionToken));

history.listen(loadRecordOnChange);

loadRecordOnChange(history.location);

function loadRecordOnChange(location) {

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
}

function parseRecordId(path) {
  const [, recordId] = path.match(/\/([a-z0-9-]*)/);
  return recordId;
}
