import MARCRecord from 'marc-record-js';
import fetch from 'isomorphic-fetch';
import { exceptCoreErrors } from '../utils';
import HttpStatus from 'http-status-codes';
import { FetchNotOkError } from '../errors';
import uuid from 'node-uuid';

import { LOAD_RECORD_START, LOAD_RECORD_ERROR, LOAD_RECORD_SUCCESS } from '../constants/action-type-constants';

export const loadRecord = (function() {
  const APIBasePath = __DEV__ ? 'http://localhost:3001/api': '/api';
  let currentRecordId;
  
  return function(recordId) {

    return function(dispatch) {
      currentRecordId = recordId;
      dispatch(loadRecordStart(recordId));
      
      return fetch(`${APIBasePath}/${recordId}`)
        .then(validateResponseStatus)
        .then(response => response.json())
        .then(json => {

          if (currentRecordId === recordId) {
            const mainRecord = json.record;
        
            const marcRecord = new MARCRecord(mainRecord);
           
            marcRecord.fields.forEach(field => {
              field.uuid = uuid.v4();
            });

            dispatch(loadRecordSuccess(recordId, marcRecord));
          }
   
        }).catch(exceptCoreErrors((error) => {

          if (error instanceof FetchNotOkError) {
            switch (error.response.status) {
              case HttpStatus.NOT_FOUND: return dispatch(loadRecordError(new Error('Tietuetta ei löytynyt')));
              case HttpStatus.INTERNAL_SERVER_ERROR: return dispatch(loadRecordError(new Error('Tietueen lataamisessa tapahtui virhe.')));
            }
          }
                  
          dispatch(loadRecordError(new Error('There has been a problem with fetch operation: ' + error.message)));
        }));
    };
  };
})();

export function loadRecordStart(recordId) {
  return { type: LOAD_RECORD_START, recordId };
}
export function loadRecordSuccess(recordId, record) {
  return { type: LOAD_RECORD_SUCCESS, recordId, record };
}
export function loadRecordError(error) {
  return { type: LOAD_RECORD_ERROR, error };
}


function validateResponseStatus(response) {
  if (response.status !== HttpStatus.OK) {
    throw new FetchNotOkError(response);
  }
  return response;
}
