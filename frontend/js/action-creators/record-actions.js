/**
*
* @licstart  The following is the entire license notice for the JavaScript code in this file.
*
* UI for transliterating MARC records in Melinda
*
* Copyright (c) 2016-2017 University Of Helsinki (The National Library Of Finland)
*
* This file is part of melinda-transliteration-ui
*
* melinda-transliteration-ui program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* oai-pmh-server-backend-module-melinda is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
* @licend  The above is the entire license notice
* for the JavaScript code in this file.
*
*/
import MARCRecord from 'marc-record-js';
import fetch from 'isomorphic-fetch';
import { exceptCoreErrors } from '../utils';
import HttpStatus from 'http-status-codes';
import { FetchNotOkError } from '../errors';
import uuid from 'node-uuid';

import { LOAD_RECORD_START, LOAD_RECORD_ERROR, LOAD_RECORD_SUCCESS,
        UPDATE_RECORD_START, UPDATE_RECORD_ERROR, UPDATE_RECORD_SUCCESS,
        CREATE_RECORD_START, CREATE_RECORD_ERROR, CREATE_RECORD_SUCCESS,
        SET_TRANSLITERATION_ENABLED, RESET_RECORD } from '../constants/action-type-constants';

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

          if (currentRecordId === recordId) {
            if (error instanceof FetchNotOkError) {
              switch (error.response.status) {
                case HttpStatus.BAD_REQUEST: return dispatch(updateRecordError(recordId, new Error(error.message)));
                case HttpStatus.NOT_FOUND: return dispatch(loadRecordError(recordId, new Error('Tietuetta ei löytynyt')));
                case HttpStatus.INTERNAL_SERVER_ERROR: return dispatch(loadRecordError(recordId, new Error('Tietueen lataamisessa tapahtui virhe.')));
              }
            }
                    
            dispatch(loadRecordError(recordId, new Error('There has been a problem with fetch operation: ' + error.message)));
          }
        }));
    };
  };
})();

export const updateRecord = (function() {
  const APIBasePath = __DEV__ ? 'http://localhost:3001/api': '/api';
  
  return function(recordId, record) {

    return function(dispatch) {

      dispatch(updateRecordStart(recordId));
      
      const fetchOptions = {
        method: 'PUT',
        body: JSON.stringify({ 
          record: record
        }),
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        credentials: 'include'
      };

      return fetch(`${APIBasePath}/${recordId}`, fetchOptions)
        .then(validateResponseStatus)
        .then(response => response.json())
        .then(json => {

          const mainRecord = json.record;
      
          const marcRecord = new MARCRecord(mainRecord);
         
          marcRecord.fields.forEach(field => {
            field.uuid = uuid.v4();
          });

          dispatch(updateRecordSuccess(recordId, marcRecord));
   
        }).catch(exceptCoreErrors((error) => {

          if (error instanceof FetchNotOkError) {
            switch (error.response.status) {
              case HttpStatus.BAD_REQUEST: return dispatch(updateRecordError(recordId, new Error(error.message)));
              case HttpStatus.NOT_FOUND: return dispatch(updateRecordError(recordId, new Error('Tietuetta ei löytynyt')));
              case HttpStatus.INTERNAL_SERVER_ERROR: return dispatch(updateRecordError(recordId, new Error('Tietueen tallentamisessa tapahtui virhe.')));
            }
          }

          dispatch(updateRecordError(recordId, new Error('There has been a problem with fetch operation: ' + error.message)));

        }));
    };
  };
})();

export function resetRecord() {
  return { type: RESET_RECORD };
}
export function loadRecordStart(recordId) {
  return { type: LOAD_RECORD_START, recordId };
}
export function loadRecordSuccess(recordId, record) {
  return { type: LOAD_RECORD_SUCCESS, recordId, record };
}
export function loadRecordError(recordId, error) {
  return { type: LOAD_RECORD_ERROR, recordId, error };
}

export function setRecord(recordId, record) {
  return function(dispatch) {

    dispatch(loadRecordStart(recordId));
    dispatch(loadRecordSuccess(recordId, record));

  };
}

export function updateRecordStart(recordId) {
  return { type: UPDATE_RECORD_START, recordId };
}
export function updateRecordSuccess(recordId, record) {
  return { type: UPDATE_RECORD_SUCCESS, recordId, record };
}
export function updateRecordError(recordId, error) {
  return { type: UPDATE_RECORD_ERROR, recordId, error };
}

export function setTransliterationEnabled(transliterationCode, enabled) {
  return { type: SET_TRANSLITERATION_ENABLED, transliterationCode, enabled };
}


export const createRecord = (function() {
  const APIBasePath = __DEV__ ? 'http://localhost:3001/api': '/api';
  
  return function(record, jobId) {

    return function(dispatch) {
      jobId = jobId || uuid.v4();
      dispatch(createRecordStart(jobId));
      
      const fetchOptions = {
        method: 'POST',
        body: JSON.stringify({ 
          record: record
        }),
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        credentials: 'include'
      };

      return fetch(`${APIBasePath}/`, fetchOptions)
        .then(validateResponseStatus)
        .then(response => response.json())
        .then(json => {

          const mainRecord = json.record;
          const recordId = json.recordId;

          const marcRecord = new MARCRecord(mainRecord);
         
          marcRecord.fields.forEach(field => {
            field.uuid = uuid.v4();
          });

          dispatch(createRecordSuccess(jobId, recordId, marcRecord));
   
        }).catch(exceptCoreErrors((error) => {

          if (error instanceof FetchNotOkError) {
            switch (error.response.status) {
              case HttpStatus.BAD_REQUEST: return dispatch(createRecordError(jobId, new Error(error.message)));
              case HttpStatus.INTERNAL_SERVER_ERROR: return dispatch(createRecordError(jobId, new Error('Tietueen tallentamisessa tapahtui virhe.')));
            }
          }

          dispatch(createRecordError(jobId, new Error('There has been a problem with fetch operation: ' + error.message)));

        }));
    };
  };
})();

export function createRecordStart(jobId) {
  return { type: CREATE_RECORD_START, jobId };
}
export function createRecordSuccess(jobId, recordId, record) {
  return { type: CREATE_RECORD_SUCCESS, jobId, recordId, record };
}
export function createRecordError(jobId, error) {
  return { type: CREATE_RECORD_ERROR, jobId, error };
}


function validateResponseStatus(response) {
  if (response.status !== HttpStatus.OK) {

    return response.text().then(errorReason => {
      throw new FetchNotOkError(response, errorReason);
    });
  }
  return response;
}
