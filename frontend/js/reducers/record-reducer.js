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
import { Map } from 'immutable';
import { LOAD_RECORD_START, LOAD_RECORD_ERROR, LOAD_RECORD_SUCCESS, SET_TRANSLITERATION_ENABLED } from '../constants/action-type-constants';
import { RESET_WORKSPACE } from '../constants/action-type-constants';

const INITIAL_STATE = Map({
  recordId: undefined,
  record: undefined,
  status: 'NOT_LOADED',
  error: undefined,
  transliterations: Map({
    sfs4900rus: true,
    iso9: true
  })
});

export default function record(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOAD_RECORD_START:
      return loadRecordStart(state, action.recordId);
    case LOAD_RECORD_ERROR:
      return loadRecordError(state, action.error, action.recordId);
    case LOAD_RECORD_SUCCESS:
      return loadRecordSuccess(state, action.recordId, action.record);
    case SET_TRANSLITERATION_ENABLED:
      return setTransliterationEnabled(state, action.transliterationCode, action.enabled);  
    case RESET_WORKSPACE:
      return INITIAL_STATE;
  }
  return state;
}

function loadRecordStart(state, recordId) {
  return state
    .set('status', 'LOAD_ONGOING')
    .set('recordId', recordId);
}

function loadRecordError(state, error, recordId) {
  if (state.get('recordId') !== recordId) {
    return state;
  }

  return state
    .set('status', 'ERROR')
    .set('error', error);
}

function loadRecordSuccess(state, recordId, record) {
  if (state.get('status') !== 'LOAD_ONGOING') {
    return state;
  }
  if (state.get('recordId') !== recordId) {
    return state;
  }

  return state
    .set('status', 'COMPLETE')
    .set('error', undefined)
    .set('record', record)
    .set('recordId', recordId);
}

function setTransliterationEnabled(state, transliterationCode, enabled) {
  return state.setIn(['transliterations', transliterationCode], enabled);
}