import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import SignIn from './SignIn';
import { withAuth } from '@okta/okta-react';

export default withAuth(class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: null
    };
    // as soon as the component is initialised we check for authentication.
    this.checkAuthentication();
  }

  // function that uses the auth properties within the withAuth wrapper from OKTA and calls isAuthenticated function.
  // it checks if auth is true then set the state to authenticated.
  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

  // On Every update check if user is authenticated or not.
  componentDidUpdate() {
    this.checkAuthentication();
  }


  onSuccess = (res) =>{
    if (res.status === 'SUCCESS') {
      return this.props.auth.redirect({
        sessionToken: res.session.token
      });
   } else {
    // The user can be in another authentication state that requires further action.
    // For more information about these states, see:
    //   https://github.com/okta/okta-signin-widget#rendereloptions-success-error
    }
  }

  onError = (err) => {
    console.log('error logging in', err);
  }

  render() {
    // if the state value of authenticated is true than redirect to the home page 
    // OR render the OKTA sign in widget.
    if (this.state.authenticated === null) return null;
    return this.state.authenticated ?
      <Redirect to={{ pathname: '/' }}/> :
      <SignIn
        baseUrl={this.props.baseUrl}
        onSuccess={this.onSuccess}
        onError={this.onError}/>;
  }
});