/**
*
* @licstart  The following is the entire license notice for the JavaScript code in this file.
*
* UI for transliterating MARC records in Melinda
*
* Copyright (c) 2016-2019 University Of Helsinki (The National Library Of Finland)
*
* This file is part of melinda-cyrillux
*
* melinda-cyrillux program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* melinda-cyrillux is distributed in the hope that it will be useful,
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
import {
  LOAD_RECORD_SUCCESS, SET_TRANSLITERATION_VALUE, TRANSFORM_RECORD_UPDATE, UPDATE_RECORD_ERROR, 
  UPDATE_RECORD_SUCCESS, RESET_RECORD, CREATE_SESSION_SUCCESS, IMPORT_RECORD_SUCCESS, 
  CREATE_RECORD_SUCCESS, CREATE_RECORD_ERROR, RESET_STATE
} from '../constants/action-type-constants';
import _ from 'lodash';
import XRegExp from 'xregexp';

const ga_id = 'UA-60393343-3';

/*eslint-disable*/
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

if (__PROD__) {
  ga('create', ga_id, 'auto');
  ga('send', 'pageview');
}

function sendEvent(category, action, label, value) {
  if (__PROD__) {
    if (window.ga) {
      ga('send', 'event', category, action, label, value);  
    }
  } else {
    console.log('send', 'event', category, action, label, value);  
  }  
}

/*eslint-enable*/
export const analyticsMiddleware = store => next => action => {
  
  const state = store.getState();
  const sfs4900Enabled = state.getIn(['record', 'transliterations', 'sfs4900rus']);
  const sfs4900EnabledLabel = sfs4900Enabled ? 'withSFS4900Rus' : 'withoutSFS4900Rus';

  switch(action.type) {
    case LOAD_RECORD_SUCCESS:
      sendEvent('record', 'load', createHasCyrillicLabel(action.record));
      break;

    case SET_TRANSLITERATION_VALUE:
      sendEvent('record', action.enabled ? `enable${action.transliterationCode}` : `disable${action.transliterationCode}`);
      break;

    case TRANSFORM_RECORD_UPDATE: 
      sendEvent('record', 'edit'); 
      break;

    case UPDATE_RECORD_ERROR:
      sendEvent('record', 'update_failed');
      break;
    
    case UPDATE_RECORD_SUCCESS:
      sendEvent('record', 'update_success', sfs4900EnabledLabel);
      break;

    case CREATE_RECORD_SUCCESS:
      sendEvent('record', 'create_success', sfs4900EnabledLabel);
      break;

    case CREATE_RECORD_ERROR:
      sendEvent('record', 'create_failed');
      break;

    case RESET_RECORD:
      sendEvent('record', 'clear');
      break;

    case CREATE_SESSION_SUCCESS:
      sendEvent('session', 'start');
      break;

    case RESET_STATE:
      sendEvent('session', 'end');
      break;

    case IMPORT_RECORD_SUCCESS:
      sendEvent('record', 'import', createHasCyrillicLabel(action.record));
      break;
  }

  return next(action);
};

function createHasCyrillicLabel(record) {
  return hasCyrillicContent(record) ? 'CONTAINS_CYRILLIC_CHARACTERS' : 'NO_CYRILLIC_CHARACTERS';
}

function hasCyrillicContent(record) {
  return _.chain(record.fields)
    .flatMap(field => _.get(field, 'subfields', []))
    .flatMap(subfield => subfield.value.split(''))
    .some(isCyrillicCharacter)
    .value();
}

function isCyrillicCharacter(char) {
  return XRegExp('[\\p{Cyrillic}]').test(char);
}
