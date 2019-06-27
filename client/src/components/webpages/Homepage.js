import React, { Component } from "react";
import Grids from "../styling/Grids";
import Nav from "../styling/Nav";
import { Route, Switch, withRouter } from "react-router-dom";
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
import aws from "../Utilities/keys";

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
        birthdate: new Date("2014-08-18T21:11:54"),
        gender: "Male",
        about:
          "Do play they miss give so up. Words to up style of since world. We leaf to snug on no need. Way own uncommonly travelling now acceptance bed compliment solicitude. Dissimilar admiration so terminated no in contrasted it. Advantages entreaties mr he apartments do. Limits far yet turned highly repair parish talked six. Draw fond rank form nor the day eat.\r\n",
        location: "Toronto",
        rate: "15",
        profile_image: "https://picsum.photos/id/234/200/300"
      }
    };
  }

  handleDateChange = date => {
    this.setState({
      profile_data: {
        ...this.state.profile_data,
        birthdate: date
      }
    });
  };
  handleGenderChange = e => {
    this.setState({
      profile_data: {
        ...this.state.profile_data,
        gender: e.target.value
      }
    });
  };
  handleTextChange = e => {
    this.setState({
      profile_data: {
        ...this.state.profile_data,
        [e.target.name]: [e.target.value]
      }
    });
  };
  verify = () => {
    const token_type = getFromStorage("dog_sitter")
      ? "dog_sitter"
      : "dog_owner";
    const url = getFromStorage("dog_sitter") ? "/user_sitter" : "/user_owner";
    const obj = getFromStorage(token_type);
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
          removeFromStorage(token_type);
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
  submitProfile = () => {};

  handleSignUp = (e, sitter) => {
    e.preventDefault();
    const lStorageName = sitter ? "dog_sitter" : "dog_owner";
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
          setInStorage(lStorageName, {
            token: result.token
          });
          this.setState({
            token: result.token,
            isAuthenticated: true,
            is_sitter: sitter,
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
        isAuthenticated: false,
        is_sitter: !sitter
      });
      alert("Please fullfill the signup Requirement");
      // console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
  };

  handleSignIn = (e, sitter) => {
    e.preventDefault();
    const lStorageName = sitter ? "dog_sitter" : "dog_owner";
    this.setState({
      isLoading: true
    });
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
          password: null
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
          is_sitter: sitter,
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
  };

  handleLogOut = e => {
    const sitter = getFromStorage("dog_sitter") ? true : false;
    e.preventDefault();
    this.setState({
      isLoading: true
    });
    const lStorageName = sitter ? "dog_sitter" : "dog_owner";
    const token = getFromStorage(lStorageName);
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
    removeFromStorage(lStorageName);
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
  uploadPhoto = e => {
    const file = e.target.files[0].name.split(".");
    let fileName = file[0];
    let fileType = file[1];
    console.log("Preparing the upload");
    axios
      .post("/upload_profile_image", {
        fileName: fileName,
        fileType: fileType
      })
      .then(response => {
        var returnData = response.data.data.returnData;
        var signedRequest = returnData.signedRequest;
        var url = returnData.url;
        this.setState({
          ...this.state.profile_data,
          profile_image: url
        });
        console.log("Recieved a signed request " + signedRequest);

        // Put the fileType in the headers for the upload
        var options = {
          headers: {
            "Content-Type": fileType
          }
        };
        axios
          .put(signedRequest, file, options)
          .then(result => {
            console.log("Response from s3");
            this.setState({ success: true });
          })
          .catch(error => {
            alert("ERROR " + JSON.stringify(error));
          });
      })
      .catch(error => {
        alert(JSON.stringify(error));
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
          profile_data={this.state.profile_data}
        />{" "}
        <Switch>
          <Route exact path="/" component={Grids} />
          <Route
            path="/signup"
            render={props => {
              return (
                <SignUp
                  {...props}
                  isAuthenticated={this.state.isAuthenticated}
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
                  isAuthenticated={this.state.isAuthenticated}
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
                  isAuthenticated={this.state.isAuthenticated}
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
                  isAuthenticated={this.state.isAuthenticated}
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
                  handleGenderChange={this.handleGenderChange}
                  handleDateChange={this.handleDateChange}
                  handleTextChange={this.handleTextChange}
                  submitProfile={this.submitProfile}
                  uploadPhoto={this.uploadPhoto}
                  profile_data={this.state.profile_data}
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
