import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import '../../styles/main.scss';
import { removeSession } from 'commons/action-creators/session-actions';
import { resetState, resetWorkspace } from 'commons/action-creators/ui-actions';
import { loadRecord, updateRecord } from '../action-creators/record-actions';
import { NavBar } from './navbar';
import { SigninFormPanelContainer } from 'commons/components/signin-form-panel';
import { RecordIdInput } from './record-id-input';
import { RecordPanel } from './record-panel';
import { WarningPanel } from './warning-panel';
import { SaveButtonPanel } from './save-button-panel';
import { replace } from 'react-router-redux';
import { saveEnabled } from '../selectors/transformed-record-selectors';

export class BaseComponent extends React.Component {

  static propTypes = {
    sessionState: React.PropTypes.string.isRequired,
    removeSession: React.PropTypes.func.isRequired,
    resetState: React.PropTypes.func.isRequired,
    resetWorkspace: React.PropTypes.func.isRequired,
    replace: React.PropTypes.func.isRequired,
    loadRecord: React.PropTypes.func.isRequired,
    updateRecord: React.PropTypes.func.isRequired,
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
    transformedRecordWarnings: React.PropTypes.array
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
    this.props.updateRecord(recordId, transformedRecord);
  }

  handleResetClick(event) {
    event.preventDefault();

    this.props.resetWorkspace();
    this.props.replace('/');
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
            <div className="col s6">
              <div className="row">
                <div className="col s6">
                  <RecordIdInput recordId={this.props.recordId} onChange={(id) => this.handleRecordIdChange(id)}/>
                </div>
                <div className="col s4">
                  <div className="input-field">
                    <a className="waves-effect waves-light btn" onClick={(e) => this.handleResetClick(e)}>UUSI</a>
                  </div>
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
              />
          </div>
          
          <div className="col s6">
            <RecordPanel 
              record={this.props.transformedRecord} 
              error={this.props.transformedRecordError}
              status={this.props.transformedRecordStatus}
              />
          </div>

        </div>

        <div className="record-actions-container">
          <div className="row">

            <div className="col s6 offset-s6">
              <WarningPanel 
                warnings={this.props.transformedRecordWarnings}
              />


              <SaveButtonPanel 
                enabled={this.props.transformedRecordSaveEnabled}
                error={this.props.transformedRecordUpdateError}
                status={this.props.transformedRecordUpdateStatus}
                onSubmit={() => this.handleRecordSave()}
              />

            </div>

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
    transformedRecordWarnings: state.getIn(['transformedRecord', 'warnings'])
  };
}

export const BaseComponentContainer = connect(
  mapStateToProps,
  { removeSession, loadRecord, updateRecord, replace, resetState, resetWorkspace}
)(BaseComponent);
