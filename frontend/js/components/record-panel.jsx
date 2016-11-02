import React from 'react';
import { MarcRecordPanel } from 'commons/components/marc-record-panel';
import { Preloader } from 'commons/components/preloader';
import '../../styles/components/record-panel.scss';

export class RecordPanel extends React.Component {

  static propTypes = {
    record: React.PropTypes.object,
    error: React.PropTypes.object,
    status: React.PropTypes.string
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

  renderSpinner() {
    return (
      <div className="marc-record-container card-panel darken-1">
        <div className="content">
          <Preloader />
        </div>
      </div>
    );
  }
  
  renderContent() {

    switch(this.props.status) {
    case 'ERROR': return this.renderError();
    case 'COMPLETE': return this.renderRecord();
    case 'LOAD_ONGOING': return this.renderSpinner();
    case 'NOT_LOADED': return null;
    }
    
    return null;
  }

  render() {
    return (
      <div className="marc-record-container card-panel darken-1">
        {this.renderContent()}
      </div>
    );
  }
}
