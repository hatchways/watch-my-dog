import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Route, Switch, Link } from "react-router-dom";
import { Grid, Paper, List, ListItem, ListItemText } from "@material-ui/core";
import Payments from "../sections/Payments";
import EditProfile from "../sections/EditProfile";

const cstyle = theme => ({
  "@global": {
    body: {
      backgroundColor: theme.bgcolor
    }
  },
  profileWrapper: {
    margin: theme.spacing(15, 30, 0, 20)
  },
  paper: {
    padding: theme.spacing(10)
  },
  link: {
    textDecoration: "none",
    color: "inherit"
  }
});

class Profile extends Component {
  render() {
    const { classes, match } = this.props;
    return (
      <div className={classes.profileWrapper}>
        <Grid container spacing={5}>
          <Grid item className={classes.profileTabs} xs={12} sm={2}>
            <List component="nav" aria-label="">
              <ListItem button>
                <Link to="/profile" className={classes.link}>
                  <ListItemText primary="Edit Profile" />
                </Link>
              </ListItem>
              <ListItem button>
                <ListItemText primary="Profile Photo" />
              </ListItem>
              <ListItem button>
                <Link to="/profile/payments" className={classes.link}>
                  <ListItemText primary="Payments" />
                </Link>
              </ListItem>
              <ListItem button>
                <ListItemText primary="Security" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="Settings" />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={10}>
            <Paper className={classes.paper}>
              <Switch>
                <Route
                  exact
                  path={`/profile`}
                  render={() => {
                    return <EditProfile match={match.path} />;
                  }}
                />
                <Route
                  path={`/profile/payments`}
                  render={() => {
                    return <Payments match={match.path} />;
                  }}
                />
              </Switch>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(cstyle)(Profile);
