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
import { TRANSFORM_RECORD_ERROR, TRANSFORM_RECORD_SUCCESS, TRANSFORM_RECORD_UPDATE } from '../constants/action-type-constants';
import { transliterate } from 'transformations/transliterate';
import MarcRecord from 'marc-record-js';
import { useSFS4900RusTransliteration } from '../selectors/record-selectors';

export function updateTransformedRecord(record) {

  return function(dispatch, getState) {

    const originalRecord = getState().getIn(['record', 'record']);

    const changedFields = findChangedFields(record, originalRecord);
    changedFields.forEach(field => {
      field.hasChanged = true;
    });

    dispatch({ type: TRANSFORM_RECORD_UPDATE, record });
  };
}

export function transformRecordSuccess(recordId, record, warnings) {
  return { type: TRANSFORM_RECORD_SUCCESS, recordId, record, warnings };
}

export function transformRecordError(recordId, error) {
  return { type: TRANSFORM_RECORD_ERROR, recordId, error };
}

export function transformRecord(recordId, record) {
  return function(dispatch, getState) {

    const copy = new MarcRecord(record);

    const options = {
      doSFS4900RusTransliteration: useSFS4900RusTransliteration(getState())
    };

    transliterate(copy, options).then(result => {
      const transliteratedRecord = result.record;
      const {warnings} = result;

      const changedFields = findChangedFields(transliteratedRecord, record);
      changedFields.forEach(field => {
        field.hasChanged = true;
      });

      dispatch(transformRecordSuccess(recordId, transliteratedRecord, warnings));
    });
  };
}

export function findChangedFields(baseRecord, compareRecord) {
  const changed = [];
  baseRecord.fields.forEach(field => {
    if (field.subfields) {
      field.subfields.forEach(subfield => {
        if (!containsSubfield(compareRecord, field, subfield)) {
          changed.push(subfield);
        }
      });

    } else {
      if (!containsControlfield(compareRecord, field)) {
        changed.push(field);
      }
    }

  });

  return changed;
}


function containsSubfield(record, field, subfield) {
  return record.fields.some(recordField => {
    if (field.tag !== recordField.tag) {
      return false;
    }
    if (field.ind1 !== recordField.ind1) {
      return false;
    }
    if (field.ind2 !== recordField.ind2) {
      return false;
    }

    return recordField.subfields.some(recordSubfield => {
      return recordSubfield.code === subfield.code && recordSubfield.value === subfield.value;
    });

  });

}

function containsControlfield(record, field) {
  return record.fields.some(recordField => controlfieldsEqual(field, recordField));
}

function controlfieldsEqual(fieldA, fieldB) {
  return fieldA.tag === fieldB.tag && fieldA.value === fieldB.value;
}

