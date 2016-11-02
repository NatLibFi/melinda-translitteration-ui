import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import '../../styles/main.scss';
import { removeSession } from 'commons/action-creators/session-actions';
import { loadRecord } from '../action-creators/record-actions';
import { NavBar } from './navbar';
import { SigninFormPanelContainer } from 'commons/components/signin-form-panel';
import { RecordIdInput } from './record-id-input';
import { RecordPanel } from './record-panel';

export class BaseComponent extends React.Component {

  static propTypes = {
    sessionState: React.PropTypes.string.isRequired,
    removeSession: React.PropTypes.func.isRequired,
    loadRecord: React.PropTypes.func.isRequired,
    userinfo: React.PropTypes.object,
    recordId: React.PropTypes.string,
    record: React.PropTypes.object,
    recordError: React.PropTypes.object
  }

  handleLogout() {
    this.props.removeSession();
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
                  <RecordIdInput recordId={this.props.recordId} onChange={this.props.loadRecord}/>
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
              />
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

function mapStateToProps(state) {

  return {
    sessionState: state.getIn(['session', 'state']),
    userinfo: state.getIn(['session', 'userinfo']),
    recordId: state.getIn(['record', 'recordId']),
    record: state.getIn(['record', 'record']),
    recordError: state.getIn(['record', 'error'])
  };
}

export const BaseComponentContainer = connect(
  mapStateToProps,
  { removeSession, loadRecord }
)(BaseComponent);
