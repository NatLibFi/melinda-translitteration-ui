import React from 'react';
import { isFileApiSupported } from 'commons/utils';
import { ISO2709 } from 'marc-record-serializers';

import '../../styles/components/record-id-input.scss';

export class FileInput extends React.Component {

  static propTypes = {
    onRecordImport: React.PropTypes.func.isRequired,
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