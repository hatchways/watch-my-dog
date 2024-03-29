import React from "react";
import { Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
// import Dates from '../Utilities/Dates';

import dogImg from "../../static/images/dog-mainpage.png";

const useStyles = makeStyles(theme => ({
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
    backgroundColor: "#f04040",
    padding: "auto 5%",
    marginTop: "2%",
    color: "#efefef"
  }
}));

export default function Grids(props) {
  const classes = useStyles();
  let location = '';
  const search_sitters = props.search_sitters;
  const handleChange = (e) =>{
    const {value} = e.target;
    location = value
  }
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
                    label="Where"
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                    onChange={handleChange}
                  />
                  <br />
                  {/* <Dates /> */}
                  <TextField
                    id="standard-name"
                    label="Date"
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"

                  />
                  <br />
                  <Button size="large" className={classes.find} spacing={2} onClick={()=>{search_sitters(location)}}>
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
