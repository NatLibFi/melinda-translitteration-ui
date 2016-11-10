import React from 'react';
import classNames from 'classnames';

import '../../styles/components/record-id-input.scss';

export class RecordIdInput extends React.Component {

  static propTypes = {
    recordId: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    disabled: React.PropTypes.bool.isRequired
  }

  handleChange(event) {
    if (!this.props.disabled) {
      this.props.onChange(event.target.value);
    }
  }

  render() {
    const labelClasses = classNames({
      active: this.props.recordId && this.props.recordId.length > 0
    });
    const recordId = this.props.recordId || '';
    
    return (
      <div className="input-field record-id">
        <label htmlFor="record-id-input" className={labelClasses}>Tietueen id</label>
        <input type="text" id="record-id-input" value={recordId} disabled={this.props.disabled} onChange={(e) => this.handleChange(e)}/>
      </div>
    );
  }
}