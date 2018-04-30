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
import { RecordPanel } from 'commons/components/record-panel';
import { Preloader } from 'commons/components/preloader';

export class RecordDisplay extends React.Component {

  static propTypes = {
    record: PropTypes.object,
    error: PropTypes.object,
    status: PropTypes.string,
    showHeader: PropTypes.bool,
    title: PropTypes.string,
    editable: PropTypes.bool,
    children: PropTypes.array,
    onRecordUpdate: PropTypes.func
  }

  renderRecord() {
    return <RecordPanel {...this.props} />;
  }

  renderError() {
    return (
      <div className="load-error red lighten-2">
        <div className="heading">Tietueen lataus epäonnistui</div>
        {this.props.error.message}
      </div>
    );
  }

  renderSpinner() {
    return (
      <div>
        <div className="card-content">
          <Preloader />
        </div>
      </div>
    );
  }

  renderContent() {

    if (this.props.status === 'ERROR') {
      return this.renderError();
    }

    return (
      <RecordPanel {...this.props}>
        { this.props.status === 'LOAD_ONGOING' ? this.renderSpinner() : null }
        {this.props.children}
      </RecordPanel>
    );
  }

  render() {
    return (
      <div className="marc-record-container card darken-1">
        {this.renderContent()}
      </div>
    );
  }
}