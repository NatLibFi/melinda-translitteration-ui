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

import '../../styles/components/warning-panel.scss';

export class WarningPanel extends React.Component {

  static propTypes = {
    warnings: PropTypes.array
  }

  renderWarningCard(text, key) {
    return (
      <div key={key} className="transform-warning card-panel amber lighten-3">{text}</div>
    );
  }

  render() {
    const warnings = this.props.warnings || [];
    
    return (
      <div className="transform-warnings-container">
        { warnings.map(this.renderWarningCard) }
      </div>
    );
  }
}
