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
import { Map } from 'immutable';
import { LOAD_RECORD_START } from '../constants/action-type-constants';
import { TRANSFORM_RECORD_ERROR, TRANSFORM_RECORD_SUCCESS, TRANSFORM_RECORD_UPDATE } from '../constants/action-type-constants';
import { RESET_WORKSPACE } from '../constants/action-type-constants';
import { UPDATE_RECORD_START, UPDATE_RECORD_ERROR, UPDATE_RECORD_SUCCESS, CREATE_RECORD_SUCCESS, CREATE_RECORD_START, CREATE_RECORD_ERROR } from '../constants/action-type-constants';

const INITIAL_STATE = Map({
  recordId: undefined,
  record: undefined,
  status: 'NOT_LOADED',
  error: undefined,
  update_status: 'NOT_UPDATED',
  update_error: undefined,
  warnings: []
});

export default function transformedRecord(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOAD_RECORD_START:
      return INITIAL_STATE;
    case TRANSFORM_RECORD_ERROR:
      return setError(state, action.error);
    case TRANSFORM_RECORD_SUCCESS:
      return setRecord(state, action.recordId, action.record, action.warnings);
    case TRANSFORM_RECORD_UPDATE:
      return updateTransformedRecord(state, action.record);

    case CREATE_RECORD_START:
      return updateStart(state);
    case UPDATE_RECORD_START:
      return updateStart(state);

    case CREATE_RECORD_ERROR:
      return updateError(state, action.error);
    case UPDATE_RECORD_ERROR:
      return updateError(state, action.error);

    case UPDATE_RECORD_SUCCESS:
      return updateSuccess(state, action.recordId, action.record);
    case CREATE_RECORD_SUCCESS:
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
    .set('update_error', undefined)
    .set('warnings', []);
}

function setRecord(state, recordId, record, warnings) {

  return state
    .set('status', 'COMPLETE')
    .set('error', undefined)
    .set('record', record)
    .set('recordId', recordId)
    .set('update_status', 'NOT_UPDATED')
    .set('update_error', undefined)
    .set('warnings', warnings);
}

function updateTransformedRecord(state, record) {
  return state.set('record', record);
}


function updateStart(state) {
  return state
    .set('update_status', 'UPDATE_ONGOING')
    .set('update_error', undefined);
}

function updateSuccess(state, recordId, record) {
  return setRecord(state, recordId, record)
    .set('update_status', 'UPDATE_SUCCESS')
    .set('update_error', undefined);
}

function updateError(state, error) {
  return state
    .set('update_status', 'UPDATE_FAILED')
    .set('update_error', error);
}
