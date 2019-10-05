import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { TextField, Paper } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import dogPaw from "../../static/images/dog-paw.png";
import { withStyles } from "@material-ui/styles";

const styles = theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.bgcolor.main
    }
  },
  paper: {
    marginTop: theme.spacing(15),
    padding: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.white
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  link: {
    color: "#3f51b5",
    textDecoration: "none"
  },
  error: {
    borderColor: theme.palette.error.main + " !important",
    color: theme.palette.error.main
  },
  logo_avatar:{
    padding: theme.spacing(1),
  }
});

class SignUp extends Component {
  // handlechane
  onSubmit = e => {
    e.preventDefault();
    const sitter = false;
    this.props.handleSignUp(e, sitter);
  };

  render() {
    const { classes, handleChange, formErrors, isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return (
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <Paper className={classes.paper}>
            <Avatar className={`${classes.avatar} + ${classes.logo_avatar}`} src={dogPaw} />
            <Typography component="h1" variant="h5">
              Owner Sign up
            </Typography>
            <form className={classes.form} noValidate onSubmit={this.onSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    onChange={handleChange}
                    InputProps={{
                      classes: {
                        notchedOutline:
                          formErrors.firstName.length > 0 ? classes.error : ""
                      }
                    }}
                  />
                  {formErrors.firstName.length > 0 && (
                    <span className={classes.error}>
                      {formErrors.firstName}
                    </span>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                    autoFocus
                    onChange={handleChange}
                    InputProps={{
                      classes: {
                        notchedOutline:
                          formErrors.lastName.length > 0 ? classes.error : ""
                      }
                    }}
                  />
                  {formErrors.lastName.length > 0 && (
                    <span className={classes.error}>{formErrors.lastName}</span>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={handleChange}
                    InputProps={{
                      classes: {
                        notchedOutline:
                          formErrors.email.length > 0 ? classes.error : ""
                      }
                    }}
                  />
                  {formErrors.email.length > 0 && (
                    <span className={classes.error}>{formErrors.email}</span>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={handleChange}
                    InputProps={{
                      classes: {
                        notchedOutline:
                          formErrors.password.length > 0 ? classes.error : ""
                      }
                    }}
                  />
                  {formErrors.password.length > 0 && (
                    <span className={classes.error}>{formErrors.password}</span>
                  )}
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign Up
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link
                    to="/userlogin"
                    variant="body2"
                    className={classes.link}
                  >
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}

export default withStyles(styles)(SignUp);
