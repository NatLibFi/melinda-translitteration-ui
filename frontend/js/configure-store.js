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
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from './root-reducer';
import {transformActor} from './middlewares/transform-actor';
import {routerMiddleware} from 'react-router-redux';
// import DevTools from './components/dev-tools';
import {analyticsMiddleware} from './middlewares/analytics';
import history from './history';

const loggerMiddleware = createLogger();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = applyMiddleware(
  thunkMiddleware,
  transformActor,
  analyticsMiddleware,
  routerMiddleware(history)

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
      composeEnhancers(middlewares, applyMiddleware(loggerMiddleware))
    );
  };
}
