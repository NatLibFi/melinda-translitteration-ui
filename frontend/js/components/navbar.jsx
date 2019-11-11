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
import {connect} from 'react-redux';
import _ from 'lodash';
import {replace} from 'react-router-redux';
import {ISO2709} from 'marc-record-serializers';
import {isFileApiSupported} from 'commons/utils';
import classNames from 'classnames';
import {resetState, resetWorkspace} from 'commons/action-creators/ui-actions';
import {resetRecord} from '../action-creators/record-actions';
import {updateOngoing} from '../selectors/transformed-record-selectors';
import {useSFS4900RusTransliteration} from '../selectors/record-selectors';
import melindaLogo from '../../images/Melinda-logo-white.png';
import '../../styles/components/navbar.scss';

export class NavBar extends React.Component {

  static propTypes = {
    onLogout: PropTypes.func.isRequired,
    appTitle: PropTypes.string.isRequired,
    username: PropTypes.string,
    updateOngoing: PropTypes.bool.isRequired,
    resetState: PropTypes.func.isRequired,
    resetRecord: PropTypes.func.isRequired,
    resetWorkspace: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    importRecords: PropTypes.func.isRequired,
    setTransliterationEnabled: PropTypes.func.isRequired,
    doSFS4900Rus: PropTypes.bool.isRequired,
    importedRecordList: PropTypes.array,
    selectImportedRecord: PropTypes.func.isRequired
  }

  componentDidMount() {
    window.$('.dropdown-navbar').dropdown({
      inDuration: 150,
      outDuration: 150,
      constrain_width: false,
      hover: false,
      gutter: 10,
      belowOrigin: true,
      alignment: 'left'
    });
    window.$('.dropdown-settings').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false,
      hover: false,
      gutter: 0,
      belowOrigin: true,
      alignment: 'right'
    });
    window.$('.dropdown-filelist').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false,
      hover: false,
      gutter: 0,
      belowOrigin: true,
      alignment: 'right'
    });
  }

  onLogout(event) {
    event.preventDefault();
    this.props.onLogout();
  }

  handleResetClick(event) {
    event.preventDefault();
    if (this.props.updateOngoing) {
      return;
    }
    
    const forms = document.getElementsByTagName('form');
    _.forEach(forms, form => form.reset());
    
    this.props.resetRecord();
    this.props.resetWorkspace();
    this.props.replace('/');
  }
  
  handleImportRecordClick(event, id) {
    event.preventDefault();
    this.props.selectImportedRecord(id);
  }

  handleSFS4900RusOptionChange(event, value) {
    event.preventDefault();
    this.props.setTransliterationEnabled('sfs4900rus', value);
  }

  handleFileSelect(event) {
    const fileList = event.target.files;

    if (fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();

      reader.addEventListener('load', (e) => {
        const fileContents = e.target.result;

        const rawRecords = fileContents.split('\x1D');

        const records = rawRecords.filter(data => data.trim() !== '').map(data => ISO2709.fromISO2709(data));

        this.props.importRecords(records);
      });

      reader.readAsText(file);
    }
  }

  render() {
    const {username, appTitle} = this.props;
    const filelistButtonClasses = classNames('dropdown-filelist', 'dropdown-button-menu', {
      disabled: this.props.importedRecordList.length < 1
    });

    return (
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper">
            <img
              className="mt-logo left"
              src={melindaLogo}
            />
            <ul id="nav" className="heading-wrapper left">
              <li className="heading">{appTitle}</li>
            </ul>
            <ul id="nav" className="right">
              <li className="tooltip" title="Käyttöohje">
                <a href="https://www.kiwi.fi/display/melinda/Kyrilliikan+translitterointi+Cyrillux-ohjelmalla" target="_blank" rel="noopener noreferrer">
                  <i className="material-icons">help_outline</i>
                </a>
              </li>
              <li className="tooltip" title="Uusi">
                <a href="#" disabled={this.props.updateOngoing} onClick={(e) => this.handleResetClick(e)}>
                  <i className="material-icons">add</i>
                </a>
              </li>
              {!isFileApiSupported() ? null :
                <li className="tooltip" title="Liitä tiedosto">
                  <label>
                    <a><i className="material-icons">attach_file</i></a>
                    <input type="file" ref={(c) => this._fileInput = c} onChange={(e) => this.handleFileSelect(e)} />
                  </label>
                </li>
              }
              {!isFileApiSupported() ? null :              
                <li className='tooltip' title="Tiedoston tietue lista">
                <label>
                  <a className={filelistButtonClasses}
                    href="#" data-activates="filelist">
                    <i className="material-icons">list</i>
                  </a>
                </label>
              </li>
              }
              <li className="tooltip" title="Asetukset">
                <a className='dropdown-settings dropdown-button-menu'
                  href="#" data-activates="settings">
                  <i className="material-icons">settings</i>
                </a>
              </li>
              <li>
                <a className="dropdown-navbar dropdown-button-menu" href="#" data-activates="mainmenu" ref={(c) => this._dropdown = c} onClick={this.preventDefault}>
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
        <ul
          id='settings'
          className='dropdown-content settings'>
          <li className="menu-title-item">
            <span>Transliterointi kenttä asetukset</span>
          </li>
          <li>
            <a href="#!" onClick={(e) => this.handleSFS4900RusOptionChange(e, !this.props.doSFS4900Rus)}>
              {this.props.doSFS4900Rus ? <i className="material-icons">check_box</i> : <i className="material-icons">check_box_outline_blank</i>}
              Venäjänkielinen SFS4900
            </a>
          </li>
        </ul>
        <ul
          id='filelist'
          className='dropdown-content filelist'>
          <li className="menu-title-item">
            <span>Tiedostosta ladatut tietueet</span>
          </li>
          {this.props.importedRecordList.map(record => {
            return (
          <li key={record.id} className='tooltip' title={record.name}>
            <a href="#!" onClick={(e) => this.handleImportRecordClick(e, record.id)}>
              {record.selected ? <i className="material-icons">check_box</i> : <i className="material-icons circle">check_box_outline_blank</i>}
              <div className='twoline-item'>
                <p className='title'>{record.name.length > 30 ? record.name.substr(0, 27) + '...' : record.name}</p>
                <p className='note tooltip' title={record.id}>{record.id.length > 30 ? record.id.substr(0, 27) + '...' : record.id}</p>
              </div>
              {record.status  === 'SAVED' ? <i className="material-icons">save</i>  : null}
            </a>
          </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    updateOngoing: updateOngoing(state),
    doSFS4900Rus: useSFS4900RusTransliteration(state)
  };
}

export const NavBarContainer = connect(
  mapStateToProps,
  {replace, resetState, resetWorkspace, resetRecord}
)(NavBar);
