import React from 'react';
import { ImportedRecordChipContainer } from './imported-record-chip';
import '../../styles/components/imported-records-container.scss';

export class ImportedRecordsPanel extends React.Component {

  static propTypes = {
    importedRecordList: React.PropTypes.array
  }

  renderImportedRecordChip(id) {
    return <ImportedRecordChipContainer key={id} id={id} />;
  }

  render() {

    return (<div className="imported-records-container">{this.props.importedRecordList.map(this.renderImportedRecordChip)}</div>);
  }

}
