import React from "react";
import { Grid, Card, Typography,TextField, CardContent, CardActions, Avatar, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LocationIcon from "@material-ui/icons/LocationOn";
import Rating from 'material-ui-rating';


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
  let location = '';
  const {search_sitters, users} = props;
  const handleChange = (e) =>{
    const {value} = e.target;
    location = value
  }
  const onSubmit=(e) =>{
    e.preventDefault();
    search_sitters(location);
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
                      <Rating
                        value={Math.floor(Math.random() * (6 - 4)) + 4}
                        max={5}
                        readOnly
                        // onChange={(value) => console.log(`Rated with value ${value}`)}
                      />
                    </Grid>
                    <Typography variant="body1" color="textPrimary" component="p" align="center">
                      {value.about_me.split('. ')[0]}
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
                          <strong>${value.rate}/hr</strong>
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
