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
import { verify } from "crypto";

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
      isLoading: true,
      isAuthenticated: false,
      is_sitter: false,
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
      },
      profile_data: {
        age: 27,
        gender: "male",
        about:
          "Esse dolore labore ad et dolor elit et. Nisi pariatur voluptate esse irure ex. Cupidatat nostrud sunt adipisicing nisi pariatur consectetur nostrud do cillum exercitation magna. Voluptate ut voluptate dolor elit irure duis dolor velit qui. Labore nulla incididunt veniam fugiat irure duis ea laboris ea laborum non adipisicing nulla. Mollit ex ullamco ut sit proident nostrud eiusmod Lorem est consequat. Non sint deserunt consectetur voluptate nisi in mollit irure.\r\n"
      }
    };
  }
  verify = () => {
    const url = this.state.is_sitter ? "/user_sitter" : "/user_owner";
    const obj = getFromStorage("dog_sitter");
    if (obj && obj.token) {
      const { token } = obj;
      this.setState({
        isLoading: true
      });
      // Verify token
      axios
        .post(url, { token })
        .then(res => res)
        .then(json => {
          if (json.status === 200) {
            this.setState({
              token,
              isAuthenticated: true,
              firstName: "Luna",
              lastName: "Rose",
              email: "lunarose@brainclip.com",
              isLoading: false
            });
          } else {
            throw Error("Unauthorized");
          }
        })
        .catch(error => {
          console.log(error.message);
          // console.log("user not found , wrong token");
          this.setState({
            isAuthenticated: false,
            token: null,
            firstName: null,
            lastName: null,
            is_sitter: false,
            email: null,
            isLoading: false
          });
          removeFromStorage("dog_sitter");
        });
    } else {
      this.setState({
        isAuthenticated: false,
        token: null,
        firstName: null,
        lastName: null,
        is_sitter: false,
        email: null,
        isLoading: false
      });
    }
  };

  componentDidMount() {
    this.verify();
  }
  handleSignUp = (e, sitter) => {
    e.preventDefault();
    console.log(sitter);
    this.setState({
      isLoading: true
    });
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
            isAuthenticated: true,
            isLoading: false
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
          alert("User already Exist");
        });
    } else {
      this.setState({
        isAuthenticated: false
      });
      alert("Please fullfill the signup Requirement");
      // console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
  };

  handleSignIn = (e, sitter) => {
    e.preventDefault();
    console.log(sitter);
    const lStorageName = sitter ? "dog_sitter" : "dog_owner";
    this.setState({
      isLoading: true
    });
    if (true) {
      axios
        .post("/login", {
          email: this.state.email,
          password: this.state.password,
          is_sitter: sitter,
          remember: true
        })
        .then(res => {
          console.log(res);
          return res.data;
        })
        .then(result => {
          this.setState({
            password: ""
          });
          return result;
        })
        .then(result => {
          setInStorage(lStorageName, {
            token: result.token
          });
          this.setState({
            token: result.token,
            isAuthenticated: true,
            is_sitter: true,
            isLoading: false
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
          // console.log(error);
          this.setState({
            isAuthenticated: false,
            isLoading: false
          });
          alert("Email and/or Password dont match");
        });
    } else {
      this.setState({
        isLoading: false
      });
      alert("Please fullfill the signup Requirement ");
      // console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
  };

  handleLogOut = e => {
    e.preventDefault();
    this.setState({
      isLoading: true
    });
    const token = getFromStorage("dog_sitter");
    removeFromStorage("dog_sitter");
    axios
      .get("/logout", { token })
      .then(res => {
        this.setState({
          token: "",
          isAuthenticated: false,
          is_sitter: false,
          isLoading: false
        });
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
          is_sitter: false,
          isLoading: false
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
  // getProfile = () => {};
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
          <Route
            path="/profile"
            render={props => {
              return (
                <Profile
                  {...props}
                  verify={this.verify}
                  isAuthenticated={this.state.isAuthenticated}
                  first_name={this.state.firstName}
                  last_name={this.state.lastName}
                  email={this.state.email}
                  isLoading={this.state.isLoading}
                />
              );
            }}
          />
        </Switch>{" "}
      </React.Fragment>
    );
  }
  // }
}

export default withRouter(Homepage);
