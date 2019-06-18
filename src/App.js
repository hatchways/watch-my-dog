import React, {Component} from 'react';
import './App.css';
import Nav from './components/styling/Nav';
import Home from './components/webpages/Home';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import SignUp from './components/authentication/SignUp';
import Login from './components/authentication/Login';


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
          <Route exact path="/" render={()=>{return <Home />}} />
          <Route exact path="/signup" render={()=>{return <SignUp />}} />
          <Route exact path="/login" render={()=>{return <Login />}} />
        </Router>
      </MuiThemeProvider>
    );
  }
}

