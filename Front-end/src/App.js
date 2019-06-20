import React, {Component} from 'react';
import './App.css';
import Nav from './components/styling/Nav';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './components/webpages/Home';
import LandingPage from './components/webpages/Landingpage';
import Login from './components/authentication/Login'
function onAuthRequired({history}){
  history.push('/login')
}
export default class App extends Component {


  render(){
    return (
      <Router>
        <div className="App">
          <Security issuer='https://dev-757854.okta.com/oauth2/default'
                  client_id='0oaq73oh6VaQ6QpZ5356'
                  redirect_uri={window.location.origin + '/implicit/callback'}
                  onAuthRequired={onAuthRequired} >
          <Nav />
          <Route exact path='/' component={Home}/>
          <SecureRoute exact path='/landingpage' component={LandingPage}/>
          <Route path='/login' render={() => <Login baseUrl='https://dev-757854.okta.com' />} />
          <Route path='/implicit/callback' component={ImplicitCallback} />
          </Security>
        </div>
      </Router>
    );
  }
}

