import React, { Component } from 'react';
// import { Grid } from '@material-ui/core';
import {Grid, TextField} from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core';


const styles = (theme) =>({

})
class EditProfile extends Component {
    constructor(){
        super();

    }
    render() {
        const classes = this.props
        return (
            <div>
                <Grid container spacing={8} >
                    <Grid container item xs={12} spacing={4}>
                        <Grid item xs={3}>
                            Name
                        </Grid>
                        <Grid item xs={9}>
                            <TextField
                                id="outlined-name"
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={3}>
                            Name
                        </Grid>
                        <Grid item xs={9}>
                            Write your name
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={3}>
                            Name
                        </Grid>
                        <Grid item xs={9}>
                            Write your name
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={3}>
                            Name
                        </Grid>
                        <Grid item xs={9}>
                            Write your name
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={3}>
                            Name
                        </Grid>
                        <Grid item xs={9}>
                            Write your name
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={3}>
                            Name
                        </Grid>
                        <Grid item xs={9}>
                            Write your name
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={3}>
                            Name
                        </Grid>
                        <Grid item xs={9}>
                            Write your name
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={3}>
                            Name
                        </Grid>
                        <Grid item xs={9}>
                            Write your name
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(EditProfile);