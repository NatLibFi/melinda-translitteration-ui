import { Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

import { RESET_STATE } from './action-creators/ui-actions';

import session from 'commons/reducers/session-reducer';
import record from './reducers/record-reducer';
import transformedRecord from './reducers/transformed-record-reducer';
import importedRecords from './reducers/imported-records-reducer';
import { LOCATION_CHANGE } from 'react-router-redux';

const INITIAL_STATE = Map();

export default function reducer(state = INITIAL_STATE, action) {
  if (action.type === RESET_STATE) {
    return combinedRootReducer(INITIAL_STATE, action);
  }
  return combinedRootReducer(state, action);
}

export const combinedRootReducer = combineReducers({
  session,
  record,
  transformedRecord,
  importedRecords,
  routing: routerReducer
});

const initialState = {
  locationBeforeTransitions: null
};

export function routerReducer(state = initialState, action) {
  if (action.type === LOCATION_CHANGE) {
    return {locationBeforeTransitions: action.payload};
  }
  return state;
}
