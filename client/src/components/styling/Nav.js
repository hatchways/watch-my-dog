import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import dogPaw from "../../static/images/dog-paw.png";
import Avatar from "@material-ui/core/Avatar";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  navbar: {
    background: "white",
    color: theme.secondary
  },
  transparentNav: {
    background: "transparent",
    boxShadow: "none",
    color: "white"
  },
  menuButton: {
    marginLeft: theme.spacing(1),
    backgroundImage: `url(${dogPaw})`
  },
  title: {
    flexGrow: 1,
    textAlign: "left",
    color: theme.secondary,
    fontWeight: "bold"
  },
  button: props => ({
    padding: theme.spacing(2, 4),
    margin: theme.spacing(2),
    color: props.history.location.pathname === "/" ? "white" : theme.secondary
  }),
  login: {
    borderColor: "#e3e3e3"
  },
  signup: {
    backgroundColor: "#f04040",
    marginRight: theme.spacing(5),
    color: "white"
  },
  link: {
    color: theme.secondary,
    textDecoration: "none"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "white"
  }
});

export default withStyles(styles)(
  class Nav extends Component {
    constructor(props) {
      super(props);
    }
    logout = e => {
      e.preventDefault();
      this.props.handleLogOut(e);
    };
    render() {
      const { classes, isAuthenticated, history, is_sitter } = this.props;
      // creating a conditional JSX to render based on whether the user is logged in or not.
      const navContent = [];
      if (!isAuthenticated) {
        navContent.push(
          <Fragment key="55">
            <Button
              component={Link}
              to="/userlogin"
              size="medium"
              variant="outlined"
              className={`${classes.button} + ${classes.login}`}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/usersignup"
              size="medium"
              className={`${classes.button} + ${classes.signup}`}
            >
              Sign Up
            </Button>
          </Fragment>
        );
      } else if (isAuthenticated) {
        navContent.push(
          <Fragment key="77">
            <Button
              component={Link}
              to="/userlogin"
              size="medium"
              variant="outlined"
              className={`${classes.button} + ${classes.login}`}
            >
              Messages
            </Button>
            <Button
              component={Link}
              to="/profile"
              size="medium"
              className={`${classes.button} + ${classes.signup}`}
            >
              Profile
            </Button>
          </Fragment>
        );
      }
      return (
        <div className={classes.root}>
          <AppBar
            position="fixed"
            className={
              history.location.pathname === "/"
                ? classes.transparentNav
                : classes.navbar
            }
          >
            <Toolbar>
              <Avatar className={classes.avatar} src={dogPaw} />
              <Typography variant="h5" className={classes.title}>
                <Link to="/" className={classes.link}>
                  Lovingsitter
                </Link>
              </Typography>
              {!is_sitter && !isAuthenticated ? (
                <Button
                  component={Link}
                  to="/signin"
                  size="medium"
                  disableRipple={true}
                  disableFocusRipple={true}
                  className={`${classes.button} + ${classes.sitterButton}`}
                >
                  <u>Become a Sitter</u>
                </Button>
              ) : (
                <Button
                  component={Link}
                  to="/"
                  size="medium"
                  disableRipple={true}
                  disableFocusRipple={true}
                  className={`${classes.button} + ${classes.sitterButton}`}
                  onClick={this.logout}
                >
                  <u>Logout</u>
                </Button>
              )}
              {navContent}
            </Toolbar>
          </AppBar>
        </div>
      );
    }
  }
);
