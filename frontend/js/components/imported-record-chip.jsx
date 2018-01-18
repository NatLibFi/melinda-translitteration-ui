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
import '../../styles/components/imported-record-chip.scss';
import { selectImportedRecord } from '../action-creators/import-actions';
import classNames from 'classnames';

export class ImportedRecordChip extends React.Component {

  static propTypes = {
    recordId: PropTypes.string.isRequired,
    selectImportedRecord: PropTypes.func.isRequired,
    status: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    buttonText: PropTypes.string.isRequired
  }

  handleClick(event) {
    event.preventDefault();
    this.props.selectImportedRecord(this.props.recordId);
  }

  isSaved() {
    return this.props.status === 'SAVED';
  }

  render() {
    const { buttonText } = this.props;

    const classes = classNames('chip', 'chip-imported-record', {
      selected: this.props.selected,
      saved: this.isSaved()
    });

    return (
      <div className={classes} title={buttonText} onClick={(e) => this.handleClick(e)}>
        <span className="truncate">{this.props.buttonText}</span>
        { this.isSaved() ? <i className="material-icons">done</i> : null }
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const recordId = state.getIn(['importedRecords', ownProps.id, 'recordId'], ownProps.id);
  const isSelected = state.getIn(['record', 'recordId']) === recordId;

  return {
    status: state.getIn(['importedRecords', ownProps.id, 'status']),
    buttonText: state.getIn(['importedRecords', ownProps.id, 'buttonText']),
    recordId: recordId,
    selected: isSelected
  };
}

export const ImportedRecordChipContainer = connect(
  mapStateToProps,
  { selectImportedRecord }
)(ImportedRecordChip);

