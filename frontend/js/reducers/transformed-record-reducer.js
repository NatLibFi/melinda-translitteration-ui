import { Map } from 'immutable';
import { LOAD_RECORD_START } from '../constants/action-type-constants';
import { TRANSFORM_RECORD_ERROR, TRANSFORM_RECORD_SUCCESS } from '../constants/action-type-constants';
import { RESET_WORKSPACE } from '../constants/action-type-constants';
import { UPDATE_RECORD_START, UPDATE_RECORD_ERROR, UPDATE_RECORD_SUCCESS } from '../constants/action-type-constants';

const INITIAL_STATE = Map({
  recordId: undefined,
  record: undefined,
  status: 'NOT_LOADED',
  error: undefined,
  update_status: 'NOT_UPDATED',
  update_error: undefined
});

export default function transformedRecord(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOAD_RECORD_START:
      return INITIAL_STATE;
    case TRANSFORM_RECORD_ERROR:
      return setError(state, action.error);
    case TRANSFORM_RECORD_SUCCESS:
      return setRecord(state, action.recordId, action.record);
    case UPDATE_RECORD_START:
      return updateStart(state);
    case UPDATE_RECORD_ERROR:
      return updateError(state, action.error);
    case UPDATE_RECORD_SUCCESS:
      return updateSuccess(state, action.recordId, action.record);
    case RESET_WORKSPACE:
      return INITIAL_STATE;
  }
  return state;
}

function setError(state, error) {
  return state
    .set('status', 'ERROR')
    .set('error', error)
    .set('update_status', 'NOT_UPDATED')
    .set('update_error', undefined);
}

function setRecord(state, recordId, record) {

  return state
    .set('status', 'COMPLETE')
    .set('error', undefined)
    .set('record', record)
    .set('recordId', recordId)
    .set('update_status', 'NOT_UPDATED')
    .set('update_error', undefined);

}

function updateStart(state) {
  return state
    .set('update_status', 'UPDATE_ONGOING');
}

function updateSuccess(state, recordId, record) {
  return setRecord(state, recordId, record)
    .set('update_status', 'UPDATE_SUCCESS');
}

function updateError(state, error) {
  return state
    .set('update_status', 'UPDATE_FAILED')
    .set('update_error', error);
}
