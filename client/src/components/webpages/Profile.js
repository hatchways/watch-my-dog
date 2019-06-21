import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import { Grid, Paper,List, ListItem, ListItemText} from '@material-ui/core';
import Payments from '../sections/Payments';
import EditProfile from '../sections/EditProfile';

const cstyle = (theme) => ({
    '@global': {
        body: {
            backgroundColor: theme.bgcolor,
        },
    },
    profileWrapper:{
        margin: theme.spacing(15,30,0,20),
    },
    paper:{
        padding: theme.spacing(10),
    }
})

class Profile extends Component {
    constructor(props){
        super(props);
    }
    render() {
        const {classes} = this.props;
        console.log(classes)
        return (
            <div className ={classes.profileWrapper}>
                <Grid container spacing={5} >
                    <Grid item className={classes.profileTabs} xs={12} sm={2}>
                    <List component="nav" aria-label="">
                        <ListItem button>
                        <ListItemText primary="Edit Profile"/>
                        </ListItem>
                        <ListItem button>
                        <ListItemText primary="Profile Photo" />
                        </ListItem>
                        <ListItem button>
                        <ListItemText primary="Payments" />
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
                        <Router> 
                            <Paper className={classes.paper}>
                                <Switch>
                                        <Route exact path='/profile/' render={()=>{return <EditProfile />}}/>
                                        <Route path='/profile/payments' render={()=>{return <Payments />}}/>
                                        {/* <Route />
                                        <Route /> */}
                                </Switch>
                            </Paper >
                        </Router>
                    </Grid>
                    
                </Grid>

            </div>
        )
    }
}

export default withStyles(cstyle)(Profile)