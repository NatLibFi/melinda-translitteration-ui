import React from 'react';

export class WarningPanel extends React.Component {

  static propTypes = {
    warnings: React.PropTypes.array
  }

  renderWarningCard(text, key) {
    return (
      <div key={key} className="transform-warning card-panel amber lighten-3">{text}</div>
    );
  }

  render() {
    const warnings = this.props.warnings || [];
    
    return (
      <div className="transform-wargnings-container">
        { warnings.map(this.renderWarningCard) }
      </div>
    );
  }
}
