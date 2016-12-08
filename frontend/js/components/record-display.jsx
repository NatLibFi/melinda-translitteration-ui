import React from 'react';
import { RecordPanel } from 'commons/components/record-panel';
import { Preloader } from 'commons/components/preloader';

export class RecordDisplay extends React.Component {

  static propTypes = {
    record: React.PropTypes.object,
    error: React.PropTypes.object,
    status: React.PropTypes.string,
    showHeader: React.PropTypes.bool,
    title: React.PropTypes.string,
    editable: React.PropTypes.bool,
    children: React.PropTypes.array,
    onRecordUpdate: React.PropTypes.func
  }

  renderRecord() {
    return <RecordPanel {...this.props} />;
  }

  renderError() {
    return (
      <div className="load-error red lighten-2">
        <div className="heading">Tietueen lataus epäonnistui</div>
        {this.props.error.message}
      </div>
    );
  }

  renderSpinner() {
    return (
      <div>
        <div className="card-content">
          <Preloader />
        </div>
      </div>
    );
  }

  renderContent() {

    if (this.props.status === 'ERROR') {
      return this.renderError();
    }

    return (
      <RecordPanel {...this.props}>
        { this.props.status === 'LOAD_ONGOING' ? this.renderSpinner() : null }
        {this.props.children}
      </RecordPanel>
    );
  }

  render() {
    return (
      <div className="marc-record-container card darken-1">
        {this.renderContent()}
      </div>
    );
  }
}