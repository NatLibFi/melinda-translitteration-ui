import React from 'react';
import '../../styles/components/navbar.scss';

export class NavBar extends React.Component {

  static propTypes = {
    onLogout: React.PropTypes.func.isRequired,
    appTitle: React.PropTypes.string.isRequired,
    username: React.PropTypes.string
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
            <ul id="nav" className="left">
              <li className="heading">{appTitle}</li>
            </ul>        
            <ul id="nav" className="right">
              <li>
                <a className="nav-dropdown" href="#" data-activates="mainmenu" ref={(c) => this._dropdown = c} onClick={this.preventDefault}>
                  <i className="material-icons right">more_vert</i>{username ? username : ''}
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <ul id='mainmenu' className='dropdown-content'>
          <li className="divider" />
          <li><a href="#" onClick={(e) => this.onLogout(e)}>Kirjaudu ulos</a></li>
        </ul>
      </div>
    );
  }
} 
