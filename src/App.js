import React, {Component} from 'react';
import './App.css';
import Nav from './components/styling/Nav';
import Home from './components/webpages/Home';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import SignUp from './components/authentication/SignUp';
import SignIn from './components/authentication/SignIn';
import UserLogIn from './components/authentication/UserLogIn';
import UserSignUp from './components/authentication/UserSignUp';


const theme = createMuiTheme({
  typography: {
    fontFamily: '"Gilroy"',
  }
});

export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>  
          <Nav />
          <Switch>
            <Route exact path="/" render={()=>{return <Home />}} />
            <Route path="/signup" render={()=>{return <SignUp />}} />
            <Route path="/signin" render={()=>{return <SignIn />}} />
            <Route path="/userlogin" render={()=>{return <UserLogIn />}} />
            <Route path="/usersignup" render={()=>{return <UserSignUp />}} />
          </Switch>
        </Router>
      </MuiThemeProvider>
    );
  }
}

