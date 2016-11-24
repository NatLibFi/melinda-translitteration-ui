import { createSelector } from 'reselect';


const importedRecordsIndex = state => state.getIn(['importedRecords', 'index']);

export const importedRecordIdList = createSelector([importedRecordsIndex], (recordsIndex) => {

  return recordsIndex ? recordsIndex.toJS() : [];

});
