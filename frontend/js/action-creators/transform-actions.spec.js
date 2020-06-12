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
import {expect} from 'chai';
import {findChangedFields} from './transform-actions';
import {MarcRecord} from '@natlibfi/marc-record';
MarcRecord.setValidationOptions({fields: false, subfields: false, subfieldValues: false});

const fakeRecord1 = MarcRecord.fromString(`LDR    abcdefghijk
001    28474
003    aaabbb
100    ‡aTest Author
245 0  ‡aSome content
245 0  ‡aTest Title‡bTest field‡cTest content`);

const fakeRecord2 = MarcRecord.fromString(`LDR    abcdefghijk
001    28474
003    aaabbb
100    ‡aTest Author
245 0  ‡aSome content
245 0  ‡aTest Title‡bChanged field‡cTest content`);

const fakeRecord3 = MarcRecord.fromString(`LDR    abcdefghijk
001    28474
003    aaabbbX
100    ‡aTest Author
245 0  ‡aSome content
245 0  ‡aTest Title‡bChanged field‡cTest content`);

describe('transform actions', () => {

  describe('findChangedFields', () => {

    it('returns empty array for identical records', () => {
      expect(findChangedFields(fakeRecord1, fakeRecord1)).to.eql([]);
    });

    it('returns an array that contains the changed subfields', () => {
      const changedSubfield = [{code: 'b', value: 'Changed field'}];
      const diff = findChangedFields(fakeRecord2, fakeRecord1);
      expect(diff).to.eql(changedSubfield);
    });

    it('returns an array that contains the changed control fields', () => {
      const changedField = [{tag: '003', value: 'aaabbbX'}, {code: 'b', value: 'Changed field'}];
      const diff = findChangedFields(fakeRecord3, fakeRecord1);
      expect(diff).to.eql(changedField);
    });

  });

});