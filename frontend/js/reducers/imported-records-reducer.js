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
* melinda-transliteration-ui is distributed in the hope that it will be useful,
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
import { Map, List } from 'immutable';
import { IMPORT_RECORD_START, IMPORT_RECORD_ERROR, IMPORT_RECORD_SUCCESS, CLEAR_IMPORTED_RECORDS, CREATE_RECORD_SUCCESS } from '../constants/action-type-constants';
import { RESET_WORKSPACE } from '../constants/action-type-constants';
import * as ImportedRecordStatus from '../constants/imported-record-status';
import _ from 'lodash';

const INITIAL_STATE = Map({
  index: List()
});

export default function importedRecords(state = INITIAL_STATE, action) {
  switch (action.type) {
    case IMPORT_RECORD_START:
      return addImportRecordJob(state, action.jobId, action.record);
    case IMPORT_RECORD_ERROR:
      return setImportRecordError(state, action.jobId);
    case IMPORT_RECORD_SUCCESS:
      return setImportedRecord(state, action.jobId, action.record, action.messages);
    case CREATE_RECORD_SUCCESS: 
      return markImportedRecordAsSaved(state, action.jobId, action.recordId);
    case CLEAR_IMPORTED_RECORDS:
      return INITIAL_STATE;
    case RESET_WORKSPACE:
      return INITIAL_STATE;
  }
  return state;
}

function addImportRecordJob(state, jobId, record) {
  return state
    .set(jobId, Map({
      jobId,
      messages: List(),
      status: ImportedRecordStatus.IMPORT_ONGOING,
      buttonText: selectButtonText(record)
    }))
    .update('index', index => index.push(jobId));
}

function setImportRecordError(state, jobId) {
  return state.update(jobId, job => job.set('status', ImportedRecordStatus.IMPORT_FAILED));  
}

function setImportedRecord(state, jobId, record, messages) {
  return state.update(jobId, job => {
    return job
      .set('record', record)
      .set('messages', messages)
      .set('status', ImportedRecordStatus.UNSAVED);
  });
}

function markImportedRecordAsSaved(state, jobId, recordId) {
  if (state.get(jobId) === undefined) {
    return state;
  }

  return state.update(jobId, job => {
    return job
      .set('record', undefined)
      .set('recordId', recordId)
      .set('status', ImportedRecordStatus.SAVED);
  });
}

function selectButtonText(record) {
  const title = _.chain(record.fields)
    .filter(field => field.tag === '245')
    .flatMap(field => field.subfields)
    .filter(sub => sub.code === 'a')
    .map(sub => sub.value)
    .head()
    .value();

  return title || 'unknown';
}