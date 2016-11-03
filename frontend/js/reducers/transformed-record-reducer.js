import { Map } from 'immutable';
import { LOAD_RECORD_START } from '../constants/action-type-constants';
import { TRANSFORM_RECORD_ERROR, TRANSFORM_RECORD_SUCCESS } from '../constants/action-type-constants';
import { RESET_WORKSPACE } from '../constants/action-type-constants';

const INITIAL_STATE = Map({
  recordId: undefined,
  record: undefined,
  status: 'NOT_LOADED',
  error: undefined
});

export default function transformedRecord(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOAD_RECORD_START:
      return INITIAL_STATE;
    case TRANSFORM_RECORD_ERROR:
      return setError(state, action.error);
    case TRANSFORM_RECORD_SUCCESS:
      return setRecord(state, action.recordId, action.record);
    case RESET_WORKSPACE:
      return INITIAL_STATE;
  }
  return state;
}

function setError(state, error) {
  return state
    .set('status', 'ERROR')
    .set('error', error);
}

function setRecord(state, recordId, record) {

  return state
    .set('status', 'COMPLETE')
    .set('error', undefined)
    .set('record', record)
    .set('recordId', recordId);
}
