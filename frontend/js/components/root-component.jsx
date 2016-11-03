/* eslint-disable react/no-multi-comp */
import React from 'react';
import { BaseComponentContainer } from './base-component';
import DevTools from './dev-tools';

if (process.env.NODE_ENV === 'production') {

  class RootComponent extends React.Component {

    render() {
      return (
        <div>
          <BaseComponentContainer {...this.props}/>
        </div>
      );
    }

  }
  module.exports = RootComponent;

} else {
  
  class RootComponent extends React.Component {

    render() {
      return (
        <div>
          <BaseComponentContainer {...this.props}/>
          <DevTools />
        </div>
      );
    }

  }
  module.exports = RootComponent;

}



