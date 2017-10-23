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

