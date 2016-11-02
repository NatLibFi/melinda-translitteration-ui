import { Map } from 'immutable';
import { LOAD_RECORD_START, LOAD_RECORD_ERROR, LOAD_RECORD_SUCCESS } from '../constants/action-type-constants';
import { RESET_WORKSPACE } from '../constants/action-type-constants';

const INITIAL_STATE = Map({
  recordId: undefined,
  record: undefined,
  status: 'NOT_LOADED',
  error: undefined
});

export default function record(state = INITIAL_STATE, action) {
  switch (action.type) {
  case LOAD_RECORD_START:
    return loadRecordStart(state, action.lowtag);
  case LOAD_RECORD_ERROR:
    return loadRecordError(state, action.error);
  case LOAD_RECORD_SUCCESS:
    return loadRecordSuccess(state, action.recordId, action.record);
  case RESET_WORKSPACE:
    return INITIAL_STATE;
  }
  return state;
}

function loadRecordStart(state) {
  return state.set('status', 'LOAD_ONGOING');
}

function loadRecordError(state, error) {
  return state
    .set('status', 'LOAD_ERROR')
    .set('error', error);
}

function loadRecordSuccess(state, recordId, record) {
  if (state.get('status') !== 'LOAD_ONGOING') {
    return state;
  }

  return state
    .set('status', 'LOAD_COMPLETE')
    .set('error', undefined)
    .set('record', record)
    .set('recordId', recordId);
}