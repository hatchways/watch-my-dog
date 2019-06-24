import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { TextField, Paper, withStyles } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import dogPaw from "../../static/images/dog-paw.png";

const styles = theme => ({
  "@global": {
    body: {
      backgroundColor: theme.bgcolor
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
    backgroundColor: theme.palette.secondary.white
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(2, 0, 2)
  },
  link: {
    color: "#3f51b5",
    textDecoration: "none"
  }
});

class SignIn extends Component {
  submit = e => {
    e.preventDefault();
    const sitter = true;
    this.props.handleSignIn(e, sitter);
  };
  render() {
    const { classes, handleChange, formErrors, token } = this.props;
    if (!token) {
      return (
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar} src={dogPaw} />
            <Typography component="h1" variant="h5">
              Sitter Sign in
            </Typography>
            <form className={classes.form} noValidate onSubmit={this.submit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleChange}
                InputProps={{
                  classes: {
                    notchedOutline:
                      formErrors.email.length > 0 ? classes.error : ""
                  }
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs style={{ marginTop: "5%" }}>
                  Forgot password?
                </Grid>
                <Grid item style={{ marginTop: "5%" }}>
                  <Link to="/signup" variant="body2" className={classes.link}>
                    {"Don't have an sitter account? Sign Up"}
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

export default withStyles(styles)(SignIn);
