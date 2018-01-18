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

import React from 'react';
import PropTypes from 'prop-types';
import { isFileApiSupported } from 'commons/utils';
import { ISO2709 } from 'marc-record-serializers';

import '../../styles/components/record-id-input.scss';

export class FileInput extends React.Component {

  static propTypes = {
    onRecordImport: PropTypes.func.isRequired,
  }

  handleFileSelect(event) {
    const fileList = event.target.files;

    if (fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();

      reader.addEventListener('load', (e) => {
        const fileContents = e.target.result;

        const rawRecords = fileContents.split('\x1D');

        const records = rawRecords.filter(data => data.trim() !== '').map(data => ISO2709.fromISO2709(data));

        this.props.onRecordImport(records);
        
      });

      reader.readAsText(file);
    }
  }

  render() {

    if (!isFileApiSupported()) {
      return null;
    }

    return (
      <form>
        <div className="file-field input-field">
          <div className="btn">
            <span>TIEDOSTO</span>
            <input type="file" ref={(c) => this._fileInput = c} onChange={(e) => this.handleFileSelect(e)}/>
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
      </form>
    );
  }
} 