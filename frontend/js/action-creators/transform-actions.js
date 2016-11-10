import { TRANSFORM_RECORD_ERROR, TRANSFORM_RECORD_SUCCESS } from '../constants/action-type-constants';

export function transformRecordSuccess(recordId, record) {
  return { type: TRANSFORM_RECORD_SUCCESS, recordId, record };
}
export function transformRecordError(error) {
  return { type: TRANSFORM_RECORD_ERROR, error };
}

export function transformRecord(recordId, record) {
  return function(dispatch) {
    dispatch(transformRecordSuccess(recordId, record));
  };
}
