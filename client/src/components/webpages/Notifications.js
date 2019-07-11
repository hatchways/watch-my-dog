import React, { Component } from 'react'
import {
    Grid,
    Paper,
    withStyles
  } from "@material-ui/core";

const cstyle = theme => ({
    root:{
        margin: theme.spacing(15,5,5,5),
        padding: theme.spacing(10)
    }


})

class Notifications extends Component {

    render() {
        const {classes} = this.props; 
        return (
            <div className={classes.root}>
                <Grid container >
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            Sitter Booking for 21st of July.
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(cstyle)(Notifications);