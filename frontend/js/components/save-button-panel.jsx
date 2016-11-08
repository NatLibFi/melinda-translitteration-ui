import React from 'react';
import '../../styles/components/save-button-panel.scss';

export class SaveButtonPanel extends React.Component {

  render() {
    return (
      <div className="row valign-wrapper save-button-panel">
        <a className="waves-effect waves-light btn">TALLENNA</a>
    
        <div className="save-status save-status-error valign">Tietueen tallennus epäonnistui. Yritä hetken päästä uudelleen, tai ota yhteyttä melinda-ylläpitoon.</div>
        
      </div>
    );
  }
}

//   <div className="save-status save-status-success valign">Tietue on tallennettu.</div>