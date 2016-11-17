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

        const record = ISO2709.fromISO2709(fileContents);

        this.props.onRecordImport(record);
        
      });

      reader.readAsText(file);
    }
  }

  render() {

    if (!isFileApiSupported()) {
      return null;
    }

    return (    
      <div className="file-field input-field">
        <div className="btn">
          <span>TIEDOSTO</span>
          <input type="file" ref={(c) => this._fileInput = c} onChange={(e) => this.handleFileSelect(e)}/>
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
    );
  }
} 