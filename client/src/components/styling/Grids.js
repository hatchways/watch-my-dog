import React, { Component } from "react";
import { Grid, Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { DateRangePicker} from 'react-dates';

import dogImg from "../../static/images/dog-mainpage.png";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  maingrid: {
    padding: theme.spacing(0),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "100vh",
    borderRadius: 0
  },
  subgrid: {
    height: "100%",
    padding: "10%"
  },
  titlewrap: {
    width: "100%",
    flexGrow: 2,
    textAlign: "start",
    color: "#1f1f1f",
    fontWeight: "400",
    alignSelf: "flex-end"
  },
  title: {
    marginTop: "20%"
  },
  container: {
    textAlign: "start"
  },
  
  searchbox: {
    width: "100%",
    flexGrow: 3
  },
  mainImg: {
    backgroundImage: `url(${dogImg})`,
    backgroundSize: "cover"
  },
  textField: {
    width: "60%"
  },
  find: {
    padding: "auto 5%",
    marginTop: "2%",
    color: "#efefef"
  },
});

class Grids extends Component{
  handleChange = (e) =>{
    const {value} = e.target;
    const location = value
    this.props.handleSearchChange({location})
  };
  render(){
    const  {classes, search_sitters, startDate,
      endDate,
      focusedInput,
      handleSearchChange} = this.props;
    return (
      <div>
        <Grid container spacing={0}>
          <Grid item xs>
            <Paper className={classes.maingrid}>
              <Grid
                container
                className={classes.subgrid}
                direction="column"
                justify="space-around"
                alignItems="center"
              >
                <Grid item xs className={classes.titlewrap}>
                  <Typography variant="h3" className={classes.title}>
                    <strong>Find the care your dog deserves.</strong>
                  </Typography>
                </Grid>
                <Grid item xs className={classes.searchbox}>
                  <form
                    className={classes.container}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="standard-name"
                      name="location"
                      label="Where"
                      className={classes.textField}
                      margin="normal"
                      variant="outlined"
                      onChange={this.handleChange}
                    />
                    <br />
                    <DateRangePicker
                      startDate={startDate} // momentPropTypes.momentObj or null,
                      startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                      endDate={endDate} // momentPropTypes.momentObj or null,
                      endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                      onDatesChange={({ startDate, endDate }) => handleSearchChange({ startDate, endDate })} // PropTypes.func.isRequired,
                      focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                      onFocusChange={focusedInput => handleSearchChange({ focusedInput })} // PropTypes.func.isRequired,
                    />
                    <br />
                    <Button size="large"  variant="contained"  color ="primary" className={classes.find} spacing={2} onClick={()=>{search_sitters()}}>
                      Find my Dog Sitter
                    </Button>
                  </form>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs>
            <Paper className={`${classes.maingrid} ${classes.mainImg}`}></Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Grids)