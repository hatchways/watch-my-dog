import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Route, Switch, Link, Redirect } from "react-router-dom";
import {
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from "@material-ui/core";
import EditProfile from "../sections/EditProfile";
import Payments from "../sections/Payments";
import Security from "../sections/Security";
import Settings from "../sections/Settings";
import ProfilePhoto from "../sections/ProfilePhoto";

const cstyle = theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.bgcolor.main
    }
  },
  profileWrapper: {
    margin: theme.spacing(15, 5, 5, 5)
  },
  paper: {
    padding: theme.spacing(5, 5)
  },
  link: {
    textDecoration: "none",
    color: "inherit"
  },
  progress: {
    margin: theme.spacing(2)
  }
});

class Profile extends Component {
  componentDidMount() {
    this.props.verify();
  }
  render() {
    const {
      classes,
      match,
      isAuthenticated,
      isLoading,
      handleDateChange,
      handleGenderChange,
      handleTextChange,
      submitProfile,
      uploadPhoto,
      deletePhoto,
      profile_data,
      is_sitter
    } = this.props;
    if (isLoading) {
      return (
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item xs={3}>
            <CircularProgress className={classes.progress} color="primary" />{" "}
          </Grid>
        </Grid>
      );
    } else if (isAuthenticated) {
      return (
        <div className={classes.profileWrapper}>
          <Grid container spacing={10}>
            <Grid
              item
              className={classes.profileTabs}
              xs={12}
              sm={12}
              md={3}
              lg={2}
            >
              <List component="nav" aria-label="">
                <Link to="/profile" className={classes.link}>
                  <ListItem button>
                    <ListItemText primary="Edit Profile" />
                  </ListItem>
                </Link>
                <Link to="/profile/photo" className={classes.link}>
                  <ListItem button>
                    <ListItemText primary="Profile Photo" />
                  </ListItem>
                </Link>
                <Link to="/profile/payments" className={classes.link}>
                  <ListItem button>
                    <ListItemText primary="Payments" />
                  </ListItem>
                </Link>
                <Link to="/profile/security" className={classes.link}>
                  <ListItem button>
                    <ListItemText primary="Security" />
                  </ListItem>
                </Link>
                <Link to="/profile/settings" className={classes.link}>
                  <ListItem button>
                    <ListItemText primary="Settings" />
                  </ListItem>
                </Link>
              </List>
            </Grid>
            <Grid item xs={12} sm={12} md={9} lg={10}>
              <Paper className={classes.paper}>
                <Switch>
                  <Route
                    exact
                    path={`/profile`}
                    render={props => {
                      return (
                        <EditProfile
                          {...props}
                          first_name={this.props.first_name}
                          last_name={this.props.last_name}
                          email={this.props.email}
                          isLoading={this.props.isLoading}
                          handleGenderChange={handleGenderChange}
                          handleDateChange={handleDateChange}
                          handleTextChange={handleTextChange}
                          submitProfile={submitProfile}
                          profile_data={profile_data}
                          is_sitter={is_sitter}

                        />
                      );
                    }}
                  />
                  <Route
                    path={`/profile/payments`}
                    render={() => {
                      return <Payments match={match.path} />;
                    }}
                  />
                  <Route
                    path={`/profile/photo`}
                    render={() => {
                      return (
                        <ProfilePhoto
                          match={match.path}
                          uploadPhoto={uploadPhoto}
                          deletePhoto={deletePhoto}
                          profile_data={this.props.profile_data}
                        />
                      );
                    }}
                  />
                  <Route
                    path={`/profile/security`}
                    render={() => {
                      return <Security match={match.path} />;
                    }}
                  />
                  <Route
                    path={`/profile/settings`}
                    render={() => {
                      return <Settings match={match.path} />;
                    }}
                  />
                </Switch>
              </Paper>
            </Grid>
          </Grid>
        </div>
      );
    } else {
      return <Redirect to="/signin" />;
    }
  }
}

export default withStyles(cstyle)(Profile);
