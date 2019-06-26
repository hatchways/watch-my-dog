import React, { Component } from "react";
// import { Grid } from '@material-ui/core';
import { Grid, TextField, MenuItem } from "@material-ui/core";
import { withStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {
  DateRangePicker,
  SingleDatePicker,
  DayPickerRangeController
} from "react-dates";

const gender = [
  {
    value: "Male",
    label: "Male"
  },
  {
    value: "Female",
    label: "Female"
  },
  {
    value: "Other",
    label: "Other"
  }
];

const months = Array.from(Array(13).keys(1));

const styles = theme => ({});
class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      focused: false
    };
  }
  render() {
    const classes = this.props;
    return (
      <div>
        <Grid container alignItems="center" justify="center" spacing={5}>
          <Grid item>
            <Typography component="h2" variant="h4" align="center" gutterBottom>
              <strong>Edit Profile</strong>
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid container item xs={12} alignItems="center" spacing={4}>
            <Grid item xs={3}>
              <Typography component="h6" variant="button" align="right">
                <strong>FIRST NAME</strong>
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                defaultValue={this.props.first_name}
                id="outlined-name"
                className={classes.textField}
                margin="normal"
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems="center" spacing={4}>
            <Grid item xs={3}>
              <Typography component="h6" variant="button" align="right">
                <strong>LAST NAME</strong>
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                defaultValue={this.props.last_name}
                id="outlined-name"
                className={classes.textField}
                margin="normal"
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems="center" spacing={4}>
            <Grid item xs={3}>
              <Typography component="h6" variant="button" align="right">
                <strong>GENDER</strong>
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                id="outlined-select-gender"
                select
                className={classes.textField}
                value="Male"
                // onChange={handleChange('currency')}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu
                  }
                }}
                margin="normal"
                variant="outlined"
              >
                {gender.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems="center" spacing={4}>
            <Grid item xs={3}>
              <Typography component="h6" variant="button" align="right">
                <strong>BIRTH DATE</strong>
              </Typography>
            </Grid>
            <Grid container item xs={9} spacing={1}>
              {/* <Grid item xs={4}>
                <TextField
                  id="outlined-select-gender"
                  select
                  className={classes.textField}
                  value="1"
                  // onChange={handleChange('currency')}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  margin="normal"
                  variant="outlined"
                  fullWidth
                >
                  {months.map(option => (
                    <MenuItem key={`${option} 124`} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-select-gender"
                  select
                  className={classes.textField}
                  value="1"
                  // onChange={handleChange('currency')}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  margin="normal"
                  fullWidth
                  variant="outlined"
                >
                  {months.map(e => (
                    <MenuItem key={`${e} 155`} value={e}>
                      {e}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-select-gender"
                  select
                  className={classes.textField}
                  value="1"
                  // onChange={handleChange('currency')}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  margin="normal"
                  variant="outlined"
                  fullWidth
                >
                  {months.map(e => (
                    <MenuItem key={e} value={e}>
                      {e}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
             */}
              <SingleDatePicker
                date={this.state.date} // momentPropTypes.momentObj or null
                onDateChange={date => this.setState({ date })} // PropTypes.func.isRequired
                focused={this.state.focused} // PropTypes.bool
                onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                id="your_unique_id" // PropTypes.string.isRequired,
                isOutsideRange={false}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems="center" spacing={4}>
            <Grid item xs={3}>
              <Typography component="h6" variant="button" align="right">
                <strong>EMAIL ADDRESS</strong>
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                defaultValue={this.props.email}
                id="outlined-name"
                className={classes.textField}
                margin="normal"
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems="center" spacing={4}>
            <Grid item xs={3}>
              <Typography component="h6" variant="button" align="right">
                <strong>WHERE YOU LIVE</strong>
              </Typography>
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
          <Grid container item xs={12} alignItems="center" spacing={4}>
            <Grid item xs={3}>
              <Typography component="h6" variant="button" align="right">
                <strong>DESCRIBE YOURSELF</strong>
              </Typography>
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
          <Grid container item xs={12} alignItems="center" spacing={4}>
            <Grid item xs={3}>
              <Typography component="h6" variant="button" align="right">
                <strong>Sitter Sign up</strong>
              </Typography>
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
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(EditProfile);
