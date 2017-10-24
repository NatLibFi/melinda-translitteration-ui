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
import { createSelector } from 'reselect';

const transformStatus = state => state.getIn(['transformedRecord', 'status']);
const updateStatus = state => state.getIn(['transformedRecord', 'update_status']);

export const saveEnabled = createSelector([transformStatus, updateStatus], (transformStatus, updateStatus) => {

  return (transformStatus === 'COMPLETE' && updateStatus !== 'UPDATE_ONGOING');

});

export const updateOngoing = createSelector([updateStatus], (updateStatus) => {
  return updateStatus === 'UPDATE_ONGOING';
});
