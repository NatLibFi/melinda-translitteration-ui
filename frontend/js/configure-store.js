/**
*
* @licstart  The following is the entire license notice for the JavaScript code in this file.
*
* UI for transliterating MARC records in Melinda
*
* Copyright (c) 2016-2017 University Of Helsinki (The National Library Of Finland)
*
* This file is part of melinda-transliteration-ui
*
* melinda-transliteration-ui program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* oai-pmh-server-backend-module-melinda is distributed in the hope that it will be useful,
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
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './root-reducer';
import { transformActor } from './middlewares/transform-actor';
import { routerMiddleware } from 'react-router-redux';
import DevTools from './components/dev-tools';
import { browserHistory } from 'react-router';
import { analyticsMiddleware } from './middlewares/analytics';

const loggerMiddleware = createLogger();

const middlewares = applyMiddleware(
  thunkMiddleware,
  routerMiddleware(browserHistory),
  transformActor,
  analyticsMiddleware
);

if (process.env.NODE_ENV === 'production') {

  module.exports = function configureStore() {
    return createStore(
      rootReducer,
      compose(middlewares)
    );
  };
  
} else {

  module.exports = function configureStore() {
    return createStore(
      rootReducer,
      compose(middlewares, applyMiddleware(loggerMiddleware), DevTools.instrument())
    );
  };
}
