import React from 'react';
import '../../styles/components/save-button-panel.scss';
import classNames from 'classnames';
import { Preloader } from 'commons/components/preloader';

export class SaveButtonPanel extends React.Component {

  static propTypes = {
    enabled: React.PropTypes.bool.isRequired,
    error: React.PropTypes.object,
    status: React.PropTypes.string.isRequired,
    onSubmit: React.PropTypes.func.isRequired
  }

  handleClick(event) {
    event.preventDefault();
    const {enabled} = this.props;

    if (enabled) {
      this.props.onSubmit();  
    }
  }

  renderMessages() {
    const {error, status} = this.props;

    if (error !== undefined) {
      return (<div className="save-status save-status-error valign">{error.message}</div>);
    }
    if (status === 'UPDATE_SUCCESS') {
      return (<div className="save-status save-status-success valign">Tietue on tallennettu</div>); 
    }
    return null;
  }

  render() {

    const {enabled, status} = this.props;

    const showPreloader = status === 'UPDATE_ONGOING';

    const buttonClasses = classNames('btn', {
      'waves-effect waves-light': enabled,
      'disabled': !enabled
    });

    return (
      <div className="row valign-wrapper save-button-panel">
        <a className={buttonClasses} onClick={(e) => this.handleClick(e)}>TALLENNA</a>
        
        {showPreloader ? <Preloader /> : this.renderMessages()}
        
      </div>
    );
  }
}
