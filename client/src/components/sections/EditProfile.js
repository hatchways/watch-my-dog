import "date-fns";
import React, { Component } from "react";
import { Grid, TextField, MenuItem, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
const genderselect = [
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

const styles = theme => ({
  about: {
    lineHeight: "2rem",
    textAlign: "justify"
  },
  save_button: {
    backgroundColor: theme.primary,
    color: "white",
    padding: theme.spacing(2, 4),
    marginTop: theme.spacing(5)
  }
});

class EditProfile extends Component {
  handleDateChange = date => {
    this.props.handleDateChange(date);
  };
  handleGenderChange = e => {
    this.props.handleGenderChange(e);
  };
  handleTextChange = e => {
    this.props.handleTextChange(e);
  };
  submitProfile = e => {
    this.props.submitProfile(e);
  };
  render() {
    const { classes, profile_data } = this.props;
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
                InputProps={{
                  readOnly: true
                }}
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
                InputProps={{
                  readOnly: true
                }}
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
                name="gender"
                className={classes.textField}
                value={profile_data.gender}
                onChange={this.handleGenderChange}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu
                  }
                }}
                margin="normal"
                variant="outlined"
              >
                {genderselect.map(option => (
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
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  disableFuture
                  openTo="year"
                  name="birthdate"
                  inputVariant="outlined"
                  format="dd/MM/yyyy"
                  views={["year", "month", "date"]}
                  value={profile_data.birthdate}
                  onChange={this.handleDateChange}
                />
              </MuiPickersUtilsProvider>
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
                InputProps={{
                  readOnly: true
                }}
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
                value={profile_data.location}
                name="location"
                margin="normal"
                variant="outlined"
                fullWidth
                onChange={this.handleTextChange}
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
                className={classes.textfield}
                defaultValue={profile_data.about}
                id="multiline-static"
                fullWidth
                InputProps={{
                  classes: {
                    input: classes.about
                  }
                }}
                InputLabelProps={{
                  shrink: true
                }}
                multiline
                margin="normal"
                name="about"
                onChange={this.handleTextChange}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems="center" spacing={4}>
            <Grid item xs={3}>
              <Typography component="h6" variant="button" align="right">
                <strong>Hire At</strong>
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="outlined-name"
                className={classes.textField}
                defaultValue={profile_data.rate}
                margin="normal"
                name="rate"
                onChange={this.handleTextChange}
                variant="outlined"
              />
            </Grid>
            <Typography component="h6" variant="h6" xs={3}>
              $
            </Typography>
          </Grid>
        </Grid>
        <Grid container alignItems="center" justify="center" spacing={5}>
          <Grid item>
            <Button
              variant="contained"
              onClick={this.submitProfile}
              className={classes.save_button}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(EditProfile);
