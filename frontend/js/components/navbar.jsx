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
import '../../styles/components/navbar.scss';
import melindaLogo from '../../images/Melinda-logo-white.png';

export class NavBar extends React.Component {

  static propTypes = {
    onLogout: PropTypes.func.isRequired,
    appTitle: PropTypes.string.isRequired,
    username: PropTypes.string
  }

  componentDidMount() {
    const navigationDropdownEl = this._dropdown;
    
    window.$(navigationDropdownEl).dropdown({
      inDuration: 150,
      outDuration: 150,
      constrain_width: false,
      hover: false,
      gutter: 0,
      belowOrigin: true,
      alignment: 'left'
    });
    
  }

  preventDefault(e) {
    e.preventDefault();
  }
  onLogout(e) {
    e.preventDefault(); 
    this.props.onLogout();
  }

  render() {
    const { username, appTitle } = this.props;

    return (
      <div className="navbar">
        <nav> 
          <div className="nav-wrapper">
          <img 
              className="mt-logo left" 
              src={melindaLogo}
            />
            <ul id="nav" className="left">
              <li className="heading">{appTitle}</li>
            </ul>        
            <ul id="nav" className="right">
            <li><a href="https://www.kiwi.fi/display/melinda/Kyrilliikan+translitterointi+Cyrillux-ohjelmalla" target="_blank" rel="noopener noreferrer">
              <i className="material-icons">help</i>
              </a></li>
              <li>
                <a className="nav-dropdown" href="#" data-activates="mainmenu" ref={(c) => this._dropdown = c} onClick={this.preventDefault}>
                  <i className="material-icons">account_circle</i>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <ul id='mainmenu' className='dropdown-content'>
          <li className="user-name-menu-item">{username ? username : ''}</li>
          <li className="divider" />
          <li><a href="#" onClick={(e) => this.onLogout(e)}>Kirjaudu ulos</a></li>
        </ul>
      </div>
    );
  }
} 
