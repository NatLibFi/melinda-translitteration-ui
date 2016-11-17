import { IMPORT_RECORD_START, IMPORT_RECORD_ERROR, IMPORT_RECORD_SUCCESS } from '../constants/action-type-constants';
import MarcRecord from 'marc-record-js';
import uuid from 'node-uuid';
import fetch from 'isomorphic-fetch';
import { exceptCoreErrors } from '../utils';
import HttpStatus from 'http-status-codes';
import { FetchNotOkError } from '../errors';

const APIBasePath = __DEV__ ? 'http://localhost:3001/conversion': '/conversion';
const conversionId = 'kyril2880ma21';

export function importRecordStart(record) {
  return { type: IMPORT_RECORD_START, record };
}

export function importRecordSuccess(record, messages) {
  return { type: IMPORT_RECORD_SUCCESS, record, messages };
}

export function importRecordError(record, error) {
  return { type: IMPORT_RECORD_ERROR, record, error };
}

export function importRecord(record) {
  
  return function(dispatch) {
    dispatch(importRecordStart(record));

    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify({ 
        record: record
      }),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };

    return fetch(`${APIBasePath}/${conversionId}`, fetchOptions)
      .then(validateResponseStatus)
      .then(response => response.json())
      .then(json => {

        const record = new MarcRecord(json.record);
        const messages = json.errors;

        record.fields.forEach(field => {
          field.uuid = uuid.v4();
        });

        dispatch(importRecordSuccess(record, messages));
 
      }).catch(exceptCoreErrors((error) => {

        if (error instanceof FetchNotOkError) {
          switch (error.response.status) {
            case HttpStatus.INTERNAL_SERVER_ERROR: return dispatch(importRecordError(record, new Error(error.message)));
          }
        }

        dispatch(importRecordError(record, new Error('Tietueen tuonti epäonnistui järjestelmävirheen vuoksi.')));
      }));

  };
}

function validateResponseStatus(response) {
  if (response.status !== HttpStatus.OK) {

    return response.text().then(errorReason => {
      throw new FetchNotOkError(response, errorReason);
    });
  }
  return response;
}
