import React from 'react';
import {connect} from 'react-redux';
import '../../styles/components/imported-record-chip.scss';
import { selectImportedRecord } from '../action-creators/import-actions';
import classNames from 'classnames';

export class ImportedRecordChip extends React.Component {

  static propTypes = {
    recordId: React.PropTypes.string.isRequired,
    selectImportedRecord: React.PropTypes.func.isRequired,
    status: React.PropTypes.string.isRequired,
    selected: React.PropTypes.bool,
    buttonText: React.PropTypes.string.isRequired
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

