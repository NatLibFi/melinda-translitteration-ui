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
import {expect} from 'chai';
import * as transformActions from '../action-creators/transform-actions';
import * as recordActions from '../action-creators/record-actions';
import reducer from '../root-reducer';
import MarcRecord from 'marc-record-js';

const fakeRecordId = '28474';
const fakeRecord = MarcRecord.fromString(`
LDR    abcdefghijk
001    28474
003    aaabbb
100    ‡aTest Author
245 0  ‡aSome content
245 0  ‡aTest Title‡bTest field‡cTest content
`);
const fakeWarnings = ['Alkuperäisen tietueen kentässä 260 ja sen linkittämässä kentässä on eri määrä osakenttiä. Osakenttien sisältö häviää'];

const fakeError = new Error('fakeError');

describe('transform record reducer', () => {
  const INITIAL_STATE = undefined;
  let state;

  describe('on TRANSFORM_RECORD_SUCCESS', () => {
  
    beforeEach(() => {
      state = reducer(INITIAL_STATE, transformActions.transformRecordSuccess(fakeRecordId, fakeRecord, fakeWarnings));
    });
    it('sets the status to COMPLETE', () => {
      expect(state.getIn(['transformedRecord', 'status'])).to.eql('COMPLETE');
    });
    it('clears the errors', () => {
      expect(state.getIn(['transformedRecord', 'error'])).to.eql(undefined);
    });
    it('clears the update status metadata', () => {
      expect(state.getIn(['transformedRecord', 'update_status'])).to.eql('NOT_UPDATED');
      expect(state.getIn(['transformedRecord', 'update_error'])).to.eql(undefined);
    });
    it('sets the record and recordId', () => {
      expect(state.getIn(['transformedRecord', 'record'])).to.eql(fakeRecord);
      expect(state.getIn(['transformedRecord', 'recordId'])).to.eql(fakeRecordId);
    });
    it('sets the transformation warnings', () => {
      expect(state.getIn(['transformedRecord', 'warnings'])).to.eql(fakeWarnings);
    });

  });


  describe('on TRANSFORM_RECORD_ERROR', () => {
  
    beforeEach(() => {
      state = reducer(INITIAL_STATE, transformActions.transformRecordError(fakeRecordId, fakeError));
    });
    it('sets the status to ERROR', () => {
      expect(state.getIn(['transformedRecord', 'status'])).to.eql('ERROR');
    });
    it('sets the error', () => {
      expect(state.getIn(['transformedRecord', 'error'])).to.eql(fakeError);
    });
    it('clears the update status metadata', () => {
      expect(state.getIn(['transformedRecord', 'update_status'])).to.eql('NOT_UPDATED');
      expect(state.getIn(['transformedRecord', 'update_error'])).to.eql(undefined);
    });
    it('clears the transformation warnings', () => {
      expect(state.getIn(['transformedRecord', 'warnings'])).to.eql([]);
    });

  });

  describe('on UPDATE_RECORD_START', () => {

    beforeEach(() => {
      state = reducer(INITIAL_STATE, recordActions.updateRecordStart());
    });
    it('sets the update_status to UPDATE_ONGOING', () => {
      expect(state.getIn(['transformedRecord', 'update_status'])).to.eql('UPDATE_ONGOING');
    });

  });

  describe('on UPDATE_RECORD_SUCCESS', () => {

    beforeEach(() => {
      state = reducer(INITIAL_STATE, recordActions.updateRecordSuccess(fakeRecordId, fakeRecord));
    });
    it('sets the update_status to UPDATE_SUCCESS', () => {
      expect(state.getIn(['transformedRecord', 'update_status'])).to.eql('UPDATE_SUCCESS');
    });

  });

  describe('on UPDATE_RECORD_ERROR', () => {

    beforeEach(() => {
      state = reducer(INITIAL_STATE, recordActions.updateRecordError(fakeRecordId, fakeError));
    });
    it('sets the update_status to UPDATE_FAILED', () => {
      expect(state.getIn(['transformedRecord', 'update_status'])).to.eql('UPDATE_FAILED');
    });
    it('sets the update_error', () => {
      expect(state.getIn(['transformedRecord', 'update_error'])).to.eql(fakeError);
    });

    describe('afterwards on UPDATE_RECORD_START', () => {
      beforeEach(() => {
        state = reducer(INITIAL_STATE, recordActions.updateRecordStart());
      });
      it('clears the error', () => {
        expect(state.getIn(['transformedRecord', 'update_error'])).to.eql(undefined);
      });

    });

  });

});
