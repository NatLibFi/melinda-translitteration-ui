import React from 'react';
import { MarcRecordPanel } from 'commons/components/marc-record-panel';
import '../../styles/components/record-panel.scss';

export class RecordPanel extends React.Component {

  static propTypes = {
    record: React.PropTypes.object,
    error: React.PropTypes.object
  }

  renderRecord() {
    return (
      <div className="marc-record-container card-panel darken-1">
        <div className="content">
          <MarcRecordPanel record={this.props.record}/>
        </div>
      </div>
    );
  }

  renderError() {
    return (
      <div className="marc-record-container card-panel darken-1">
         <div className="load-error red lighten-2">
          <div className="heading">Tietueen lataus epäonnistui</div>
          {this.props.error.message}
        </div>
      </div>
    );
  }

  render() {
    return this.props.error ? this.renderError() : this.renderRecord();
  }
}
