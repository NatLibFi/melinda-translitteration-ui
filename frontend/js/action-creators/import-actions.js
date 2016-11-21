import { IMPORT_RECORD_START, IMPORT_RECORD_ERROR, IMPORT_RECORD_SUCCESS, CLEAR_IMPORTED_RECORDS } from '../constants/action-type-constants';
import MarcRecord from 'marc-record-js';
import uuid from 'node-uuid';
import fetch from 'isomorphic-fetch';
import { exceptCoreErrors } from '../utils';
import HttpStatus from 'http-status-codes';
import { FetchNotOkError } from '../errors';
import { push } from 'react-router-redux';

const APIBasePath = __DEV__ ? 'http://localhost:3001/conversion': '/conversion';
const conversionId = 'bookwhere_utf8';

export function selectImportedRecord(jobId) {
  
  return function(dispatch) {
    return dispatch(push(`/${jobId}`));
  };
}

export function importRecordStart(jobId, record) {
  return { type: IMPORT_RECORD_START, jobId, record };
}

export function importRecordSuccess(jobId, record, messages) {
  return { type: IMPORT_RECORD_SUCCESS, jobId, record, messages };
}

export function importRecordError(jobId, record, error) {
  return { type: IMPORT_RECORD_ERROR, jobId, record, error };
}

export function clearImportedRecords() {
  return { type: CLEAR_IMPORTED_RECORDS };
}

export function importRecords(records) {
  return function(dispatch) {
    dispatch(clearImportedRecords());

    records.forEach(record => dispatch(importRecord(record)));

  };
}

export function importRecord(record) {
  
  return function(dispatch) {
    const jobId = uuid.v4();
    dispatch(importRecordStart(jobId, record));

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

        dispatch(importRecordSuccess(jobId, record, messages));
 
      }).catch(exceptCoreErrors((error) => {

        if (error instanceof FetchNotOkError) {
          switch (error.response.status) {
            case HttpStatus.INTERNAL_SERVER_ERROR: return dispatch(importRecordError(jobId, record, new Error(error.message)));
          }
        }

        dispatch(importRecordError(jobId, record, new Error('Tietueen tuonti epäonnistui järjestelmävirheen vuoksi.')));
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
