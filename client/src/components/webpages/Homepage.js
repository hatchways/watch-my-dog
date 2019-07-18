import React, { Component } from "react";
import Grids from "../styling/Grids";
import Nav from "../styling/Nav";
import { Route, Switch, withRouter } from "react-router-dom";
import SignUp from "../authentication/SignUp";
import SignIn from "../authentication/SignIn";
import UserSignUp from "../authentication/UserSignUp";
import UserLogIn from "../authentication/UserLogIn";
import SitterInfo from '../sections/SitterInfo'; 
import Profile from "../webpages/Profile";
import Notifications from "../webpages/Notifications";
import axios from "axios";
import {
  setInStorage,
  getFromStorage,
  removeFromStorage
} from "../Utilities/storage";
import SearchGrid from "../styling/SearchGrid";


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
      file: null,
      isLoading: true,
      isAuthenticated: false,
      is_sitter: false,
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      token: null,
      startDate: null,
      endDate: null,
      focusedInput: null,
      location: null,
      formErrors: {
        firstName: "",
        lastName: "",
        email: "",
        password: ""
      },
      profile_data: {
        birthdate: "Fri Jan 01 1999 21:11:54 GMT-0500 (Eastern Standard Time)",
        gender: 0,
        about_me: "",
        location: "",
        rate: "",
        profile_image:""
      },
      search_results:[],
      selectedDate: null,
      currentSitter: ""
    }
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
        [e.target.name]: String([e.target.value])
      }
    });
  };
  handleSearchChange = (obj) =>{
    const arr = Object.entries(obj);
    arr.forEach(ele=>{
      this.setState({
        [ele[0]]: ele[1]
      })
    })
  };
  handleSelectedDate = date => {
    console.log(date);
    this.setState({
      selectedDate:  date
    });
  };
  verify = () => {
    const token_type = !!getFromStorage("dog_sitter")
      ? "dog_sitter"
      : "dog_owner";
    const url = !!getFromStorage("dog_sitter") ? "/user_sitter" : "/user_owner";
    const obj = getFromStorage(token_type);
    if (obj && obj.token) {
      const { token } = obj;
      this.setState({
        isLoading: true
      });
      // Verify token
      const options = {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        data: {
          token
        },
        url
      };
      axios(options)
        // .post(url, { token })
        .then(res => res)
        .then(res => {
          if (res.status === 200) {
            this.setState({
              token,
              isAuthenticated: true,
              firstName: res.data.first_name,
              lastName: res.data.last_name,
              email: res.data.email,
              isLoading: false,
              is_sitter: !!getFromStorage("dog_sitter")? true : false, 
              profile_data: {
                ...this.state.profile_data,
                gender: res.data.gender === null ? 0 : res.data.gender,
                about_me: res.data.about_me || "",
                location: res.data.location || "",
                rate: res.data.rate || "",
                birthdate:
                  res.data.birthdate ||
                  "Fri Jan 01 1999 21:11:54 GMT-0500 (Eastern Standard Time)",
                profile_image: res.data.profile_image
              }
            });
          } else {
            throw Error("Unauthorized");
          }
        })
        .catch(error => {
          console.log(error.message);
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
  submitProfile = () => {
    const token_type = !!getFromStorage("dog_sitter")
      ? "dog_sitter"
      : "dog_owner";
    const url = "/api/update_profile/";
    const obj = getFromStorage(token_type);
    if (obj && obj.token) {
      const { token } = obj;
      this.setState({
        isLoading: true
      });
      const options = {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        data: {
          token,
          is_sitter: !!getFromStorage("dog_sitter"),
          profile_data: this.state.profile_data
        },
        url
      };
      axios(options)
        .then(res => {
          if (res.status === 200) {
            this.setState({
              isAuthenticated: true,
              isLoading: false,
              profile_data: {
                ...this.state.profile_data,
                gender: res.data.gender,
                about_me: res.data.about_me,
                location: res.data.location,
                rate: res.data.rate,
                birthdate: res.data.birthdate
              }
            });
          } else {
            throw Error;
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  };

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
      .then(result => {
        console.log(result);
        return result.data;
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
          isLoading: false,
          profile_data:{
            profile_image: result.profile_image
          }
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
          isAuthenticated: false,
          isLoading: false
        });
        alert("Email and/or Password dont match");
      });
  };

  handleLogOut = e => {
    const sitter = getFromStorage("dog_sitter") || false;
    e.preventDefault();
    this.setState({
      isLoading: true
    });
    const lStorageName = sitter ? "dog_sitter" : "dog_owner";
    const token = getFromStorage(lStorageName);
    const options = {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
      url : "/logout"
    }
    axios(options)
      .then(res => {
        this.setState({
          token: "",
          isAuthenticated: false,
          is_sitter: false,
          isLoading: false,
          profile_data: {
            birthdate: "Fri Jan 01 1999 21:11:54 GMT-0500 (Eastern Standard Time)",
            gender: 0,
            about_me: "",
            location: "",
            rate: "",
            profile_image:""
          }
        });
        return res;
      })
      .then(() => {
        if (!this.state.isAuthenticated) {
          this.props.history.push("/");
        }
      })
      .catch(error => {
        this.setState({
          token: "",
          isAuthenticated: false,
          is_sitter: false,
          isLoading: false,
          profile_data: {
            birthdate: "Fri Jan 01 1999 21:11:54 GMT-0500 (Eastern Standard Time)",
            gender: 0,
            about_me: "",
            location: "",
            rate: "",
            profile_image:""
          }
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
    const token_type = !!getFromStorage("dog_sitter")
      ? "dog_sitter"
      : "dog_owner";
    const obj = getFromStorage(token_type);
    if (obj && obj.token) {
      const { token } = obj;
      this.setState({
        isLoading: true,
        file: e.target.files[0]
      });
      let formData = new FormData();
      formData.append("file", e.target.files[0]);
      const url = "/upload_profile_image";
      const config = {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data"
        }
      };
      axios
        .post(url, formData, config)
        .then(response => {
          this.setState({
            profile_data: {
              ...this.state.profile_data,
              profile_image: response.data.profile_image
            }
          });
        })
        .then(() => {
          this.setState({
            isLoading: false
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
  deletePhoto = e => {
    const imageurl = "/delete_image";
    const token_type = !!getFromStorage("dog_sitter")
      ? "dog_sitter"
      : "dog_owner";
    const obj = getFromStorage(token_type);
    if (obj && obj.token) {
      const { token } = obj;
      this.setState({
        isLoading: true
      });
      const image_url = this.state.profile_data.profile_image;
      const file_name = image_url.substring(image_url.lastIndexOf("/") + 1);
      const options2 = {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        data: {
          file_name,
          token
        },
        url: imageurl
      };
      axios(options2)
        .then(res => {
          this.setState({
            profile_data: {
              ...this.state.profile_data,
              profile_image: res.data.profile_image
            }
          });
        })
        .then(() => {
          this.setState({
            isLoading: false
          });
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  };
  search_sitters = ()=>{
    const {location, startDate, endDate} = this.state;
    // if(location && startDate && endDate){
    if(location){
      axios.post("/search_sitter", {location, startDate, endDate})
        .then(res=>{
            if(res.data.users.length > 0){
            this.setState({
              search_results: res.data.users
            })
          }
          else{
            throw Error("No Sitters Found. Try different dates or Location")
          }
        })
        .then(()=>{
          this.props.history.push(`/search/location?=${location}`);
        })
        .catch(error=>{
          console.log(error);
          alert(error);
        })
    }
    else{
      alert("Please enter location & select dates.");
    }
  }
  routeTo = (index) =>{
    console.log(this.state.search_results[index])
    const promise = new Promise((resolve, reject)=>{
      resolve();
    })
    promise
      .then(()=>{
        this.setState({
          currentSitter : this.state.search_results[index]
        })
      })
      .then(()=>{
        this.props.history.push(`/sitter?=${this.state.currentSitter.first_name}`);
      })
      .catch((error)=>{
        console.log(error);
      })
  }

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
          <Route exact path="/" render={props => {
             return (
                <Grids
                  {...props}
                  search_sitters={this.search_sitters}
                  handleSearchChange = {this.handleSearchChange}
                  startDate= {this.state.startDate}
                  endDate = {this.state.endDate} 
                  focusedInput = {this.state.focusedInput}
                  location={this.state.location}
                />
              );
             }}
          />
          <Route path={`/search`} render={props => {
             return (
                <SearchGrid
                  {...props}
                  search_sitters={this.search_sitters}
                  handleSearchChange = {this.handleSearchChange}
                  routeTo = {this.routeTo}
                  users = {this.state.search_results}
                  startDate= {this.state.startDate}
                  endDate = {this.state.endDate} 
                  focusedInput = {this.state.focusedInput}
                  location={this.state.location}
                />
              );
             }}
          />
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
                  deletePhoto={this.deletePhoto}
                  is_sitter={this.state.is_sitter}
                  profile_data={this.state.profile_data}
                />
              );
            }}
          />{" "}
          <Route
            path="/notifications"
            render={ () => {
              return (
                <Notifications
                  isAuthenticated={this.state.isAuthenticated}
                />
              );
            }}
          />
          <Route
            path="/sitter"
            render={props => {
              return (
                <SitterInfo
                  {...props}
                  isAuthenticated={this.state.isAuthenticated}
                  currentSitter = {this.state.currentSitter}
                  handleSelectedDate= {this.handleSelectedDate}
                  selectedDate= {this.state.selectedDate}
                  handleSearchChange = {this.handleSearchChange}

                />
              );
            }}
          />{" "}
        </Switch>{" "}
      </React.Fragment>
    );
  }
  // }
}

export default withRouter(Homepage);
