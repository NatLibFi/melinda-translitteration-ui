import { transformRecord } from '../action-creators/transform-actions';
import { LOAD_RECORD_SUCCESS, SET_TRANSLITERATION_ENABLED } from '../constants/action-type-constants';

export const transformActor = store => next => action => {
  const result = next(action);

  if (action.type === LOAD_RECORD_SUCCESS) {    
    store.dispatch(transformRecord(action.recordId, action.record));  
  }

  if (action.type === SET_TRANSLITERATION_ENABLED) {
    const recordId = store.getState().getIn(['record', 'recordId']);
    const record = store.getState().getIn(['record', 'record']);
    
    store.dispatch(transformRecord(recordId, record));  
  }

  return result;
};

