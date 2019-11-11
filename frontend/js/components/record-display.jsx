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

import React from 'react';
import PropTypes from 'prop-types';
import {RecordPanel} from 'commons/components/record-panel';
import {ErrorMessagePanel} from 'commons/components/error-message-panel';
import {Preloader} from 'commons/components/preloader';
import {WarningPanel} from './warning-panel';
import {SaveButtonPanel} from 'commons/components/save-button-panel';
import {isImportedRecordId} from '../utils';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import _ from 'lodash';
import {resetRecord, loadRecord, updateRecord, createRecord} from '../action-creators/record-actions';
import {replace} from 'react-router-redux';
import {resetState, resetWorkspace} from 'commons/action-creators/ui-actions';
import {updateTransformedRecord} from '../action-creators/transform-actions';
import {importRecords} from '../action-creators/import-actions';
import {saveEnabled, updateOngoing} from '../selectors/transformed-record-selectors';
import {importedRecordIdList} from '../selectors/imported-record-selectors';
import classNames from 'classnames';
import '../../styles/components/record-display.scss';

export class RecordDisplay extends React.Component {

  static propTypes = {
    recordId: PropTypes.string,
    record: PropTypes.object,
    error: PropTypes.object,
    status: PropTypes.string,
    showHeader: PropTypes.bool,
    title: PropTypes.string,
    editable: PropTypes.bool,
    children: PropTypes.array,
    onRecordUpdate: PropTypes.func,

    sessionState: PropTypes.string.isRequired,
    resetState: PropTypes.func.isRequired,
    resetWorkspace: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    loadRecord: PropTypes.func.isRequired,
    updateRecord: PropTypes.func.isRequired,
    createRecord: PropTypes.func.isRequired,
    recordError: PropTypes.object,
    recordStatus: PropTypes.string.isRequired,
    transformedRecord: PropTypes.object,
    transformedRecordError: PropTypes.object,
    transformedRecordStatus: PropTypes.string.isRequired,
    transformedRecordUpdateError: PropTypes.object,
    transformedRecordUpdateStatus: PropTypes.string.isRequired,
    transformedRecordSaveEnabled: PropTypes.bool.isRequired,
    transformedRecordWarnings: PropTypes.array,
    updateTransformedRecord: PropTypes.func.isRequired,
    importRecords: PropTypes.func.isRequired,
    importedRecordList: PropTypes.array,
    resetRecord: PropTypes.func.isRequired,
    updateOngoing: PropTypes.bool.isRequired,
  }

  constructor() {
    super();

    this.state = {editMode: false};
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

  handleChange(event) {
    if (!this.props.updateOngoing) {
      this.props.replace(`/${event.target.value}`);
    }
  }

  handleEditModeChange(event) {
    event.preventDefault();
    this.setState({editMode: !this.state.editMode});
  }

  handleRecordSave() {
    const {recordId, transformedRecord} = this.props;
    if (isImportedRecordId(recordId)) {
      const idFromRecord = id(transformedRecord);

      if (idFromRecord === undefined) {
        this.props.createRecord(transformedRecord, recordId);
      } else {
        this.props.updateRecord(idFromRecord, transformedRecord);
      }
    } else {
      this.props.updateRecord(recordId, transformedRecord);
    }

    function id(record) {
      return _.chain(record.get('001')).head().get('value').value();
    }
  }

  recordInput(id, value, disable, label) {
    return (
      <div className="row title-row-card">
        <div className="input-field col 12s">
          <input id={id} type="tel" value={value} onChange={(e) => this.handleChange(e)} disabled={disable} />
          {value ? <label className="active" htmlFor={id}>{label}</label> : <label htmlFor={id}>{label}</label>}
        </div>
      </div>
    );
  }

  renderSourceRecordPanel(recordState, errorMessage, record) {

    const sourceField = this.recordInput('record-id-input', this.props.recordId, this.props.updateOngoing, 'Lähdetietue');

    if (this.props.status === 'ERROR') {
      return (<ErrorMessagePanel
        typePanel
        recordHeader={sourceField}
        error={errorMessage} />);
    }

    return (
      <RecordPanel
        showHeader
        recordHeader={sourceField}
        record={record}
      >
        {recordState === 'LOAD_ONGOING' ? this.renderSpinner() : null}
        {this.props.children}
      </RecordPanel>
    );
  }

  transformedHeader(record = null) {
    const editButtonClasses = classNames({
      disabled: !record,
      active: this.state.editMode
    });

    return (
      <div className="row title-row-card">
        <div className="title-wrapper col 11s">
          <ul ref={(c) => this._tabs = c}>
            <li className="title">Käännöstietue</li>
            <li className="button tooltip" title="Muokkaa"><a className={editButtonClasses} href="#" onClick={(e) => this.handleEditModeChange(e)}><i className="material-icons">edit</i></a></li>
          </ul>
        </div>
      </div>
    );
  }

  renderTransformedRecordPanel(recordState, errorMessage, record) {
    if (this.props.status === 'ERROR') {
      return (<ErrorMessagePanel
        typePanel
        recordHeader={this.transformedHeader(record)}
        error={errorMessage} />);
    }

    return (
      <RecordPanel
        showHeader
        editable={this.state.editMode}
        recordHeader={this.transformedHeader(record)}
        record={record}
        onRecordUpdate={(record) => this.props.updateTransformedRecord(record)}
      >
        {recordState === 'LOAD_ONGOING' ? this.renderSpinner() : null}

        <div className="card-content">
          <WarningPanel
            warnings={this.props.transformedRecordWarnings}
          />
        </div>
        {this.props.transformedRecord !== undefined ? this.renderSave() : null}
      </RecordPanel>
    );
  }

  renderSave() {
    return (
      <div className="card-action">
        <SaveButtonPanel
          enabled={this.props.transformedRecordSaveEnabled}
          error={this.props.transformedRecordUpdateError}
          status={this.props.transformedRecordUpdateStatus}
          onSubmit={() => this.handleRecordSave()}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="row">
        <div className="col s6">
          <div className="marc-record-container card darken-1">
            {this.renderSourceRecordPanel(this.props.recordStatus, this.props.recordError, this.props.record)}
          </div>
        </div>
        <div className="col s6">
          <div className="marc-record-container card darken-1">
            {this.renderTransformedRecordPanel(this.props.transformedRecordStatus, this.props.transformedRecordError, this.props.transformedRecord)}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    sessionState: state.getIn(['session', 'state']),
    recordId: ownProps.match.params.id,
    record: state.getIn(['record', 'record']),
    recordError: state.getIn(['record', 'error']),
    recordStatus: state.getIn(['record', 'status']),
    transformedRecord: state.getIn(['transformedRecord', 'record']),
    transformedRecordError: state.getIn(['transformedRecord', 'error']),
    transformedRecordStatus: state.getIn(['transformedRecord', 'status']),
    transformedRecordSaveEnabled: saveEnabled(state),
    transformedRecordUpdateError: state.getIn(['transformedRecord', 'update_error']),
    transformedRecordUpdateStatus: state.getIn(['transformedRecord', 'update_status']),
    transformedRecordWarnings: state.getIn(['transformedRecord', 'warnings']),
    importedRecordList: importedRecordIdList(state),
    updateOngoing: updateOngoing(state)
  };
}

export const RecordDisplayContainer = withRouter(connect(
  mapStateToProps,
  {loadRecord, updateRecord, replace, resetState, resetWorkspace, updateTransformedRecord, importRecords, createRecord, resetRecord}
)(RecordDisplay));