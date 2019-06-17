
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import '@okta/okta-signin-widget/dist/css/okta-theme.css';

export default class SignIn extends Component {
  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    this.widget = new OktaSignIn({
      features: {
        registration: true,                 // Enable self-service registration flow
        rememberMe: true,                   // Setting to false will remove the checkbox to save username
      },
      baseUrl: this.props.baseUrl
    });
    this.widget.renderEl({el}, this.props.onSuccess, this.props.onError);
  }

  componentWillUnmount() {
    this.widget.remove();
  }

  render() {
    return <div />;
  }
};