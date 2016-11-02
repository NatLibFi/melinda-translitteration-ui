import React from 'react';

import '../../styles/components/record-id-input.scss';

export class RecordIdInput extends React.Component {

  static propTypes = {
    recordId: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
  }

  handleChange(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    return (
      <div className="input-field record-id">
        <label htmlFor="record-id-input">Tietueen id</label>
        <input type="text" id="record-id-input" value={this.props.recordId} onChange={(e) => this.handleChange(e)}/>
      </div>
    );
  }
}