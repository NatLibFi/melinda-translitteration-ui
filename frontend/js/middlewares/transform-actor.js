import { transformRecord } from '../action-creators/transform-actions';
import { LOAD_RECORD_SUCCESS } from '../constants/action-type-constants';

export const transformActor = store => next => action => {
  const result = next(action);

  if (action.type === LOAD_RECORD_SUCCESS) {    
    store.dispatch(transformRecord(action.recordId, action.record));  
  }
  return result;
};

