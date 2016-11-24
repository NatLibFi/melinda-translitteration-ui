import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import '../../styles/main.scss';
import { removeSession } from 'commons/action-creators/session-actions';
import { resetState, resetWorkspace } from 'commons/action-creators/ui-actions';
import { loadRecord, updateRecord, createRecord } from '../action-creators/record-actions';
import { updateTransformedRecord } from '../action-creators/transform-actions';
import { importRecord } from '../action-creators/import-actions';
import { NavBar } from './navbar';
import { SigninFormPanelContainer } from 'commons/components/signin-form-panel';
import { RecordIdInput } from './record-id-input';
import { FileInput } from './file-input';
import { RecordPanel } from './record-panel';
import { WarningPanel } from './warning-panel';
import { SaveButtonPanel } from './save-button-panel';
import { replace } from 'react-router-redux';
import { saveEnabled, updateOngoing } from '../selectors/transformed-record-selectors';

export class BaseComponent extends React.Component {

  static propTypes = {
    sessionState: React.PropTypes.string.isRequired,
    removeSession: React.PropTypes.func.isRequired,
    resetState: React.PropTypes.func.isRequired,
    resetWorkspace: React.PropTypes.func.isRequired,
    replace: React.PropTypes.func.isRequired,
    loadRecord: React.PropTypes.func.isRequired,
    updateRecord: React.PropTypes.func.isRequired,
    createRecord: React.PropTypes.func.isRequired,
    userinfo: React.PropTypes.object,
    recordId: React.PropTypes.string,
    record: React.PropTypes.object,
    recordError: React.PropTypes.object,
    recordStatus: React.PropTypes.string.isRequired,
    transformedRecord: React.PropTypes.object,
    transformedRecordError: React.PropTypes.object,
    transformedRecordStatus: React.PropTypes.string.isRequired,
    transformedRecordUpdateError: React.PropTypes.object,
    transformedRecordUpdateStatus: React.PropTypes.string.isRequired,
    transformedRecordSaveEnabled: React.PropTypes.bool.isRequired,
    transformedRecordWarnings: React.PropTypes.array,
    updateOngoing: React.PropTypes.bool.isRequired,
    updateTransformedRecord: React.PropTypes.func.isRequired,
    importRecord: React.PropTypes.func.isRequired
  }

  handleLogout() {
    this.props.replace('/');
    this.props.removeSession();
    this.props.resetState();
  }

  handleRecordIdChange(id) {
 
    this.props.replace(`/${id}`);
  }

  handleRecordSave() {
    const {recordId, transformedRecord} = this.props;
    if (recordId === 'imported') {
      const idFromRecord = id(transformedRecord);

      if (idFromRecord === undefined) {
        this.props.createRecord(transformedRecord);    
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

    this.props.resetWorkspace();
    this.props.replace('/');
  }

  handleRecordImport(record) {
    
    this.props.importRecord(record);
    this.handleRecordIdChange('imported');

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
            <div className="col s10">
              <div className="row">
                <div className="col s3">
                  <RecordIdInput recordId={this.props.recordId} disabled={this.props.updateOngoing} onChange={(id) => this.handleRecordIdChange(id)}/>
                </div>
                <div className="col s2">
                  <div className="input-field">
                    <a className="waves-effect waves-light btn" disabled={this.props.updateOngoing} onClick={(e) => this.handleResetClick(e)}>UUSI</a>
                  </div>
                </div>

                <div className="col s4">
                  <FileInput onRecordImport={(record) => this.handleRecordImport(record)}/>
                </div>

              </div>
              
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col s6">
            <RecordPanel 
              record={this.props.record} 
              error={this.props.recordError}
              status={this.props.recordStatus}
              showHeader
              title='Alkuperäinen'
            />
          </div>
          
          <div className="col s6">
            <RecordPanel 
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

              <div className="card-action">
                <SaveButtonPanel 
                  enabled={this.props.transformedRecordSaveEnabled}
                  error={this.props.transformedRecordUpdateError}
                  status={this.props.transformedRecordUpdateStatus}
                  onSubmit={() => this.handleRecordSave()}
                />
              </div>
              
            </RecordPanel>
          </div>

        </div>

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
    updateOngoing: updateOngoing(state)
  };
}

export const BaseComponentContainer = connect(
  mapStateToProps,
  { removeSession, loadRecord, updateRecord, replace, resetState, resetWorkspace, updateTransformedRecord, importRecord, createRecord }
)(BaseComponent);
