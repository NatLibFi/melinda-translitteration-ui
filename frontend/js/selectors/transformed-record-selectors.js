import { createSelector } from 'reselect';

const transformStatus = state => state.getIn(['transformedRecord', 'status']);
const updateStatus = state => state.getIn(['transformedRecord', 'update_status']);

export const saveEnabled = createSelector([transformStatus, updateStatus], (transformStatus, updateStatus) => {

  return (transformStatus === 'COMPLETE' && updateStatus !== 'UPDATE_ONGOING');

});

export const updateOngoing = createSelector([updateStatus], (updateStatus) => {
  return updateStatus === 'UPDATE_ONGOING';
});
