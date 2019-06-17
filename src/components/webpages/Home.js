import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import Button from '@material-ui/core/Button';


export default withAuth(class Home extends Component {
  constructor(props) {
    super();
    this.state = { authenticated: null };
  }


  checkAuthentication = async () => {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }
  // checking authentication on every componenet lifecycle event
  async componentDidMount (){
    this.checkAuthentication();
  }

  async componentDidUpdate(){
    this.checkAuthentication();
  }
  // function that handles login & logout

  login = async () => {
    this.props.auth.login('/');
  }

  logout = async () => {
    this.props.auth.logout('/');
  }

  render() {
    // conditional rendering of content based on whether user is logged in or not.
    if (this.state.authenticated === null) return null;

    const testcontent = this.state.authenticated ?
    (
    <div>
        <h2>
        Success! You Have been Logged In.
        </h2>
        <Button onClick={this.logout}>Logout</Button>
    </div>
    )
    :
    (
    <div>
        <h2>
            Please Login or Create an account.
        </h2>
        <Button onClick={this.login}>Login / Signup</Button>
    </div>
    );

    return (
      <div>
        {testcontent}
      </div>
    );
  }
});

