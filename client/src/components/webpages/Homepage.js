import React, { Component } from "react";
import Grids from "../styling/Grids";
import Nav from "../styling/Nav";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import SignUp from "../authentication/SignUp";
import SignIn from "../authentication/SignIn";
import UserSignUp from "../authentication/UserSignUp";
import UserLogIn from "../authentication/UserLogIn";
import Profile from "../webpages/Profile";
import axios from "axios";
import {
  setInStorage,
  getFromStorage,
  removeFromStorage
} from "../Utilities/storage";

// email and password validation by Regular expression
const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);
const passRegex = RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
);

// form validation
const formValid = ({ formErrors, ...rest }) => {
  let valid = true;

  // validate form errors being empty
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  });

  // validate the form was filled out
  // Object.values(rest).forEach(val => {
  //   val === null && (valid = false);
  // });

  return valid;
};
class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      is_sitter: false,
      // currentPath: window.location.pathname,
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      token: null,
      formErrors: {
        firstName: "",
        lastName: "",
        email: "",
        password: ""
      }
    };
  }

  componentDidMount() {
    const obj = getFromStorage("dog_sitter");
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      axios
        .post("/user_sitter", { token })
        .then(res => res)
        .then(json => {
          if (json.status == 200) {
            this.setState({
              token,
              isAuthenticated: true
            });
          }
        });
    } else {
      this.setState({ isAuthenticated: false });
    }
  }

  handleSignUp = (e, sitter) => {
    e.preventDefault();
    if (formValid(this.state)) {
      axios
        .post("/register", {
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          email: this.state.email,
          password: this.state.password,
          is_sitter: sitter
        })
        .then(res => res.data)
        .then(result => {
          this.setState({
            email: "",
            password: ""
          });
          return result;
        })
        .then(result => {
          setInStorage("dog_sitter", {
            token: result.token
          });
          this.setState({
            token: result.token,
            isAuthenticated: true
          });
          if (result.token) {
            // Redirect();
          }
          return result;
        })
        .then(result => {
          if (this.state.isAuthenticated) {
            this.props.history.push("/profile");
          }
          return result;
        })
        .catch(error => {
          console.log(error);
          alert("User already Exist");
        });
    } else {
      this.setState({
        isAuthenticated: false
      });
      alert("Please fullfill the signup Requirement");
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
  };

  handleSignIn = (e, sitter) => {
    e.preventDefault();
    if (true) {
      axios
        .post("/login", {
          email: this.state.email,
          password: this.state.password,
          is_sitter: sitter,
          remember: true
        })
        .then(res => res.data)
        .then(result => {
          this.setState({
            password: ""
          });
          return result;
        })
        .then(result => {
          setInStorage("dog_sitter", {
            token: result.token
          });
          this.setState({
            token: result.token,
            isAuthenticated: true,
            is_sitter: true
          });
          return result;
        })
        .then(result => {
          if (this.state.isAuthenticated) {
            this.props.history.push("/");
          }
          return result;
        })
        .catch(error => {
          this.setState({
            isAuthenticated: false
          });
          alert("Email and/or Password dont match");
        });
    } else {
      alert("Please fullfill the signup Requirement ");
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
  };

  handleLogOut = e => {
    e.preventDefault();
    const token = getFromStorage("dog_sitter");
    axios
      .get("/logout")
      .then(res => {
        this.setState({
          token: "",
          isAuthenticated: false,
          is_sitter: false
        });
        removeFromStorage("dog_sitter");
        return res;
      })
      .then(res => {
        if (!this.state.isAuthenticated) {
          this.props.history.push("/");
        }
      })
      .catch(error => {
        this.setState({
          token: "",
          isAuthenticated: false,
          is_sitter: false
        });
      });
  };
  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = {
      ...this.state.formErrors
    };
    if (name === "firstName") {
      formErrors.firstName =
        value.length < 3 ? "minimum 3 characaters required" : "";
    } else if (name === "lastName") {
      formErrors.lastName =
        value.length < 3 ? "minimum 3 characaters required" : "";
    } else if (name === "email") {
      formErrors.email = emailRegex.test(value) ? "" : "invalid email address";
    } else if (name === "password") {
      formErrors.password = passRegex.test(value)
        ? ""
        : "minimum 8 characaters, 1 Uppercase, 1 lowercase, 1 special character, 1 number";
    }
    this.setState({
      formErrors,
      [name]: value
    });
  };

  render() {
    return (
      <React.Fragment>
        <Nav
          {...this.props}
          is_sitter={this.state.is_sitter}
          isAuthenticated={this.state.isAuthenticated}
          handleLogOut={this.handleLogOut}
        />{" "}
        <Switch>
          <Route exact path="/" component={Grids} />
          <Route
            path="/signup"
            render={props => {
              return (
                <SignUp
                  {...props}
                  token={this.state.token}
                  formErrors={this.state.formErrors}
                  handleChange={this.handleChange}
                  handleSignUp={this.handleSignUp}
                />
              );
            }}
          />{" "}
          <Route
            path="/signin"
            render={props => {
              return (
                <SignIn
                  {...props}
                  token={this.state.token}
                  formErrors={this.state.formErrors}
                  handleChange={this.handleChange}
                  handleSignIn={this.handleSignIn}
                />
              );
            }}
          />
          <Route
            path="/userlogin"
            render={props => {
              return (
                <UserLogIn
                  {...props}
                  token={this.state.token}
                  formErrors={this.state.formErrors}
                  handleChange={this.handleChange}
                  handleSignIn={this.handleSignIn}
                />
              );
            }}
          />{" "}
          <Route
            path="/usersignup"
            render={props => {
              return (
                <UserSignUp
                  {...props}
                  token={this.state.token}
                  formErrors={this.state.formErrors}
                  handleChange={this.handleChange}
                  handleSignUp={this.handleSignUp}
                />
              );
            }}
          />{" "}
          <Route path="/profile" component={Profile} />
        </Switch>{" "}
      </React.Fragment>
    );
  }
  // }
}

export default withRouter(Homepage);
