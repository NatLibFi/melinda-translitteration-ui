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
import {connect} from 'react-redux';
import _ from 'lodash';
import '../../styles/main.scss';
import {removeSession} from 'commons/action-creators/session-actions';
import {resetState, resetWorkspace} from 'commons/action-creators/ui-actions';
import {resetRecord, loadRecord, updateRecord, createRecord, setTransliterationEnabled} from '../action-creators/record-actions';
import {updateTransformedRecord} from '../action-creators/transform-actions';
import {importRecords} from '../action-creators/import-actions';
import {NavBar} from './navbar';
import {SigninFormPanelContainer} from 'commons/components/signin-form-panel';
import {RecordDisplayContainer} from './record-display';
import {replace} from 'react-router-redux';
import {withRouter} from 'react-router';
import {saveEnabled, updateOngoing} from '../selectors/transformed-record-selectors';
import {importedRecordIdList} from '../selectors/imported-record-selectors';
import {selectImportedRecord} from '../action-creators/import-actions';
import {useSFS4900RusTransliteration} from '../selectors/record-selectors';

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
    resetRecord: PropTypes.func.isRequired,
    setTransliterationEnabled: PropTypes.func.isRequired,
    doSFS4900Rus: PropTypes.bool,
    selectImportedRecord: PropTypes.func.isRequired
  }

  handleLogout() {
    this.props.replace('/');
    this.props.removeSession();
    this.props.resetState();
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

  renderValidationIndicator() {
    return null;
  }

  renderSignin() {
    if (this.props.sessionState === 'VALIDATION_ONGOING') {
      return this.renderValidationIndicator();
    } else {
      return (<SigninFormPanelContainer title='Cyrillux' />);
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
          resetRecord={this.props.resetRecord}
          replace={this.props.replace}
          resetWorkspace={this.props.resetWorkspace}
          resetState={this.props.resetState}
          updateOngoing={this.props.updateOngoing}
          importRecords={this.props.importRecords}
          doSFS4900Rus={this.props.doSFS4900Rus}
          setTransliterationEnabled={this.props.setTransliterationEnabled}
          importedRecordList={this.props.importedRecordList}
          selectImportedRecord={this.props.selectImportedRecord}
        />
        <RecordDisplayContainer />
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
    updateOngoing: updateOngoing(state),
    importedRecordList: importedRecordIdList(state).map(id => ({
      id,
      name: state.getIn(['importedRecords', id, 'buttonText']),
      status: state.getIn(['importedRecords', id, 'status']),
      selected: ownProps.match.params.id === id
    })),
    doSFS4900Rus: useSFS4900RusTransliteration(state)
  };
}

export const BaseComponentContainer = withRouter(connect(
  mapStateToProps,
  {selectImportedRecord, removeSession, loadRecord, updateRecord, replace, resetState, setTransliterationEnabled, resetWorkspace, updateTransformedRecord, importRecords, createRecord, resetRecord}
)(BaseComponent));
