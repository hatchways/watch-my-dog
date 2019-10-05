import React from "react";
import { Grid, Typography,TextField, Button} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DateRangePicker} from 'react-dates';
import SearchGridItems from "./SearchGridItems";




const useStyles = makeStyles(theme => ({
  parent:{
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(10, 7.5)
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(10, 5)
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(5, 10)
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(5, 10)
    },
  },
  root:{
    marginTop: theme.spacing(10),
  },
  card:{
    padding: theme.spacing(0, 2)
  },
  h1:{
    color: "black"
  },
  profilePhoto: {
    height: 100,
    width: 100,
  },
  textField: {
    width: "100%"
  },
  form:{
    [theme.breakpoints.down('xs')]: {
      width:"100%"
    },
    [theme.breakpoints.up('md')]: {
      width:"50%"
    },
    [theme.breakpoints.up('lg')]: {
      width:"50%"
    },
    width:"50%"
  },
  light:{
    color:theme.palette.light.main,
    marginLeft: theme.spacing(0.5)
  },
  find: {
    backgroundColor: theme.palette.primary.main,
    padding: "10% auto",
    marginLeft: "2%",
    color: "#efefef"
  },
  resultgrid:{
    margin: theme.spacing(2,0),
    padding: theme.spacing(5,0)
  }
}));

export default function SearchGrid(props) {
  const classes = useStyles();
  const {
    search_sitters, 
    users, 
    startDate,
    endDate,
    focusedInput,
    handleSearchChange,
    routeTo} = props;
  const handleChange = (e) =>{
      const {value} = e.target;
      const location = value
      props.handleSearchChange({location})
  };
  const gridJSX = users.map((value, index)=>{
      return <SearchGridItems 
                key = {index}
                value = {value}
                routeTo= {()=>{routeTo(index)}}
            />
  })

  return (
    <div className={classes.parent} >
      <Grid container className={classes.root}>
        <Grid item xs={12} >
            <Typography variant="h4" align="center">
              Your Search Results
            </Typography>
            <Grid
              container
              justify="center"
              alignItems="center"
              className={classes.avatarGrid}
            >
            <form className={classes.form}  noValidate autoComplete="off">
              <TextField
                        id="standard-name"
                        label="Where"
                        className={classes.textField}
                        margin="normal"
                        variant="outlined"
                        inputProps={{
                          align:"center" 
                        }}
                        onChange={handleChange}
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
                <Button size="medium" className={classes.find} onClick={()=>{search_sitters()}}>
                      Find my Dog Sitter
                </Button>
              <br />
            </form>
            </Grid>
                        
        </Grid>
        <Grid item xs={12} className={classes.resultgrid} >
            <Grid container justify="center" spacing={10}>
                {gridJSX}
            </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
