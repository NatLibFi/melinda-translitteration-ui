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
import {connect} from 'react-redux';
import _ from 'lodash';
import '../../styles/main.scss';
import { removeSession } from 'commons/action-creators/session-actions';
import { resetState, resetWorkspace } from 'commons/action-creators/ui-actions';
import { resetRecord, loadRecord, updateRecord, createRecord, setTransliterationEnabled } from '../action-creators/record-actions';
import { updateTransformedRecord } from '../action-creators/transform-actions';
import { importRecords } from '../action-creators/import-actions';
import { NavBar } from './navbar';
import { SigninFormPanelContainer } from 'commons/components/signin-form-panel';
import { RecordIdInput } from './record-id-input';
import { FileInput } from './file-input';
import { RecordDisplay } from './record-display';
import { WarningPanel } from './warning-panel';
import { SaveButtonPanel } from './save-button-panel';
import { replace } from 'react-router-redux';
import { saveEnabled, updateOngoing } from '../selectors/transformed-record-selectors';
import { importedRecordIdList } from '../selectors/imported-record-selectors';
import { ImportedRecordsPanel } from './imported-records-panel';
import { isImportedRecordId } from '../utils';
import { useSFS4900RusTransliteration } from '../selectors/record-selectors';

export class BaseComponent extends React.Component {

  static propTypes = {
    sessionState: PropTypes.string.isRequired,
    removeSession: PropTypes.func.isRequired,
    resetState: PropTypes.func.isRequired,
    resetWorkspace: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    loadRecord: PropTypes.func.isRequired,
    updateRecord: PropTypes.func.isRequired,
    createRecord: PropTypes.func.isRequired,
    userinfo: PropTypes.object,
    recordId: PropTypes.string,
    record: PropTypes.object,
    recordError: PropTypes.object,
    recordStatus: PropTypes.string.isRequired,
    transformedRecord: PropTypes.object,
    transformedRecordError: PropTypes.object,
    transformedRecordStatus: PropTypes.string.isRequired,
    transformedRecordUpdateError: PropTypes.object,
    transformedRecordUpdateStatus: PropTypes.string.isRequired,
    transformedRecordSaveEnabled: PropTypes.bool.isRequired,
    transformedRecordWarnings: PropTypes.array,
    updateOngoing: PropTypes.bool.isRequired,
    updateTransformedRecord: PropTypes.func.isRequired,
    importRecords: PropTypes.func.isRequired,
    importedRecordList: PropTypes.array,
    setTransliterationEnabled: PropTypes.func.isRequired,
    resetRecord: PropTypes.func.isRequired,
    doSFS4900Rus: PropTypes.bool
  }

  handleLogout() {
    this.props.replace('/');
    this.props.removeSession();
    this.props.resetState();
  }

  handleRecordIdChange(id) {
 
    this.props.replace(`/${id}`);
  }

  handleSFS4900RusOptionChange(e) {

    this.props.setTransliterationEnabled('sfs4900rus', e.target.checked);
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

  handleResetClick(event) {
    event.preventDefault();
    if (this.props.updateOngoing) {
      return;
    }

    const forms = document.getElementsByTagName('form');
    _.forEach(forms, form => form.reset());

    this.props.resetRecord();
    this.props.resetWorkspace();
    this.props.replace('/');
  }

  handleRecordImport(records) {
    
    this.props.importRecords(records);
    
  }

  renderValidationIndicator() {
    return null;
  }

  renderSignin() {
    if (this.props.sessionState === 'VALIDATION_ONGOING') {
      return this.renderValidationIndicator();
    } else {
      return (<SigninFormPanelContainer title='Cyrillux'/>);
    }
  }

  renderMainPanel() {

    const firstName = _.head(_.get(this.props.userinfo, 'name', '').split(' '));
  
    return (
      <div>
        <NavBar 
          onLogout={() => this.handleLogout()}
          username={firstName}
          appTitle='Cyrillux'
        />

        <div className="record-selector-container">
          <div className="row">
            <div className="col s12">
              <div className="row row-compact">
                <div className="col s3">
                  <RecordIdInput recordId={this.props.recordId} disabled={this.props.updateOngoing} onChange={(id) => this.handleRecordIdChange(id)}/>
                </div>
                <div className="col s1">
                  <div className="input-field">
                    <a className="waves-effect waves-light btn" disabled={this.props.updateOngoing} onClick={(e) => this.handleResetClick(e)}>UUSI</a>
                  </div>
                </div>

                <div className="col s3">
                  <FileInput onRecordImport={(record) => this.handleRecordImport(record)}/>
                </div>

                <div className="col s5">
                  <ImportedRecordsPanel importedRecordList={this.props.importedRecordList} />
                </div>

              </div>
              <div className="row">
                <div className="col s12">
                  <input type="checkbox" className="filled-in" id="do-sfs4900-rus-transliteration" onChange={(e) => this.handleSFS4900RusOptionChange(e)} checked={this.props.doSFS4900Rus} />
                  <label htmlFor="do-sfs4900-rus-transliteration">Tee myös venäjänkielisen SFS4900 translitteroinnin mukaiset kentät.</label>
                </div>
              </div>

            </div>
          </div>
        </div>
     
        <div className="row">
          <div className="col s6">
            <RecordDisplay 
              record={this.props.record} 
              error={this.props.recordError}
              status={this.props.recordStatus}
              showHeader
              title='Alkuperäinen'
            />
          </div>
          
          <div className="col s6">
            <RecordDisplay 
              record={this.props.transformedRecord} 
              error={this.props.transformedRecordError}
              status={this.props.transformedRecordStatus}
              showHeader
              title='Translitteroitu'
              editable
              onRecordUpdate={(record) => this.props.updateTransformedRecord(record)}>

              <div className="card-content">
                <WarningPanel 
                  warnings={this.props.transformedRecordWarnings}
                />
              </div>

              { this.props.transformedRecord !== undefined ? this.renderSave() : null }
              
            </RecordDisplay>
          </div>

        </div>

      </div>
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
    
    if (this.props.sessionState == 'SIGNIN_OK') {
      return this.renderMainPanel();
    } else if (this.props.sessionState == 'VALIDATION_ONGOING') {
      return this.renderValidationIndicator();
    } else {
      return this.renderSignin();
    }

  }
}

function mapStateToProps(state, ownProps) {

  return {
    sessionState: state.getIn(['session', 'state']),
    userinfo: state.getIn(['session', 'userinfo']),
    recordId: ownProps.routeParams.id,
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
    updateOngoing: updateOngoing(state),
    importedRecordList: importedRecordIdList(state),
    doSFS4900Rus: useSFS4900RusTransliteration(state)
  };
}

export const BaseComponentContainer = connect(
  mapStateToProps,
  { removeSession, loadRecord, updateRecord, replace, resetState, resetWorkspace, updateTransformedRecord, importRecords, createRecord, setTransliterationEnabled, resetRecord }
)(BaseComponent);
