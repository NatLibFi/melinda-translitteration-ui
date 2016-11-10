import { TRANSFORM_RECORD_ERROR, TRANSFORM_RECORD_SUCCESS } from '../constants/action-type-constants';
import { transliterate } from 'transformations/transliterate';
import MarcRecord from 'marc-record-js';

export function transformRecordSuccess(recordId, record, warnings) {
  return { type: TRANSFORM_RECORD_SUCCESS, recordId, record, warnings };
}
export function transformRecordError(error) {
  return { type: TRANSFORM_RECORD_ERROR, error };
}

export function transformRecord(recordId, record) {
  return function(dispatch) {

    const copy = new MarcRecord(record);

    transliterate(copy).then(result => {
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