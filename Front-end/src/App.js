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
import axios from 'axios';


const theme = createMuiTheme({
  typography: {
    fontFamily: '"Gilroy"',
  },
  primary: "#f04040",
  secondary: "#1f1f1f",
  error: "#d8000c",
});
// email and password validation by Regular expression
const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
const passRegex = RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

// form validation 
const formValid = ({ formErrors, ...rest }) => {
  let valid = true;

  // validate form errors being empty
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  });

  // validate the form was filled out
  Object.values(rest).forEach(val => {
    val === null && (valid = false);
  });

  return valid;
};

export default class App extends Component {
  constructor(props){
    super(props);
    this.state={
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      formErrors:{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      }
    }
  }

  handleSubmit = e => {
    console.log(e);
    e.preventDefault();
    if (formValid(this.state)) {
      axios.post('/signup_sitter', {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
      })
      .then(res => res.json())
      .then(json => {
        console.log('json', json);
          this.setState({
            email: '',
            password: '',
          });
        // .then(()=>{
        //   localStorage.setItem()
        // })
        }
      )
      .catch((error)=>{
        console.log(error);
      })
    } else {
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
  };

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };
      if (name === "firstName"){
          formErrors.firstName =
            value.length < 3 ? "minimum 3 characaters required" : "";
      }
      else if (name === "lastName"){
          formErrors.lastName =
            value.length < 3 ? "minimum 3 characaters required" : "";
      }
      else if (name === "email"){
          formErrors.email = emailRegex.test(value)
            ? ""
            : "invalid email address";
      }
      else if (name === "password"){
          formErrors.password =
            passRegex.test(value) ? "" : "minimum 8 characaters, 1 Uppercase, 1 lowercase, 1 special character, 1 number";
      }  
    this.setState({ formErrors, [name]: value });
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>  
          <Nav />
          <Switch>
            <Route exact path="/" render={()=>{return <Home />}} />
            <Route path="/signup" render={()=>{return <SignUp formErrors={this.state.formErrors} handleChange={this.handleChange} handleSubmit={this.handleSubmit}/>}} />
            <Route path="/signin" render={()=>{return <SignIn />}} />
            <Route path="/userlogin" render={()=>{return <UserLogIn />}} />
            <Route path="/usersignup" render={()=>{return <UserSignUp />}} />
          </Switch>
        </Router>
      </MuiThemeProvider>
    );
  }
}

