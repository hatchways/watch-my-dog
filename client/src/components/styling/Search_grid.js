import React from "react";
import { Grid, Card, Typography,TextField, CardContent, CardActions, Avatar, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LocationIcon from "@material-ui/icons/LocationOn";
import { DateRangePicker} from 'react-dates';


// import SvgIcon from '@material-ui/core/SvgIcon';


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
  find: {
    backgroundColor: "#f04040",
    padding: "1% 2%",
    color: "#efefef"
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
  location:{
    color: theme.primary
  },
  light:{
    color:theme.light,
    marginLeft: theme.spacing(0.5)
  }
}));

export default function Search_grid(props) {
  const classes = useStyles();
  const {search_sitters, users, startDate,
    endDate,
    focusedInput,
    handleSearchChange} = props;
  const handleChange = (e) =>{
      const {value} = e.target;
      const location = value
      props.handleSearchChange({location})
  };
  const onSubmit = (e) =>{
    console.log("in submit")
    e.preventDefault();
    search_sitters();
  }
  return (
    <div className={classes.parent} >
      <Grid container className={classes.root} spacing={5}>
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
            <form className={classes.form} onSubmit={onSubmit} noValidate autoComplete="off">
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
              <br />
            </form>
            </Grid>
                        
        </Grid>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={10}>
            {users.map((value, index) => (
              <Grid key={index} item xs={12} sm={6} md={6} lg={4}>
                <Card className={classes.card}>
                  <CardContent >
                    <Grid
                      container
                      justify="center"
                      alignItems="center"
                      className={classes.avatarGrid}
                    >
                      <Avatar
                        alt="Remy Sharp"
                        src={value.profile_image}
                        className={classes.profilePhoto}
                      />
                    </Grid>
                    <Typography gutterBottom variant="h5" component="h2" align="center">
                      {value.first_name} {value.last_name}
                    </Typography>
                    <Grid
                      container
                      justify="center"
                      alignItems="center"
                    >
                    </Grid>
                    <Typography variant="body1" color="textPrimary" noWrap component="p" align="center">
                      {/* {value.about_me.split(' ').slice(0, 10).join(' ') } */}
                      {value.about_me}
                    </Typography>
                  </CardContent>
                  <Divider />
                  <CardActions >
                    <Grid container
                      justify="center"
                      alignItems="center" pb={5}>
                      <Grid container item xs={6} direction="row" alignItems="center">
                        <Grid item>
                          <LocationIcon className={classes.location} />
                        </Grid>
                        <Grid item>
                          <Typography gutterBottom variant="subtitle2" align="center" className={classes.light}>
                            {value.location} 
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography gutterBottom variant="subtitle1" align="right">
                          <strong>${value.rate}/day</strong>
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>              
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>

  );
}
