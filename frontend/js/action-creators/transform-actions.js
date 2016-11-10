import { TRANSFORM_RECORD_ERROR, TRANSFORM_RECORD_SUCCESS } from '../constants/action-type-constants';
import { transliterate } from 'transformations/transliterate';
import MarcRecord from 'marc-record-js';

export function transformRecordSuccess(recordId, record) {
  return { type: TRANSFORM_RECORD_SUCCESS, recordId, record };
}
export function transformRecordError(error) {
  return { type: TRANSFORM_RECORD_ERROR, error };
}

export function transformRecord(recordId, record) {
  return function(dispatch) {

    const copy = new MarcRecord(record);

    transliterate(copy).then(transliteratedRecord => {
      dispatch(transformRecordSuccess(recordId, transliteratedRecord));
    });
  };
}
