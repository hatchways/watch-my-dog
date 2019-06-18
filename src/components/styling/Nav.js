import React from 'react';
import {Link} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import dogPaw from '../../static/images/dog-paw.png';
import Avatar from '@material-ui/core/Avatar';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  navbar:{
    background: 'transparent', 
    boxShadow: 'none'
  },
  menuButton: {
    marginLeft: theme.spacing(1),
    backgroundImage: `url(${dogPaw})`,
  },
  title: {
    flexGrow: 1,
    textAlign: "left",
    color: "#1f1f1f",
    fontWeight: "bold",
  },
  button:{
    padding: "1% 3%",
    margin: "1%",
    color: "inherit",
  },
  sitterButton:{
    textTransform: "lowercase",
    marginRight: theme.spacing(5),
  },
  login:{
    borderColor: "#e3e3e3",
  },
  signup:{
    backgroundColor: "#f04040",
    marginRight: theme.spacing(5),
  },
  link:{
    color:"inherit",
    textDecoration:"none",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.common.white,
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.navbar}>
        <Toolbar>
        <Avatar className={classes.avatar} src={dogPaw} />
          <Typography variant="h5" className={classes.title}>
            <Link to='/' className={classes.link}>
              Lovingsitter
            </Link>
          </Typography>
          <Button size="medium" disableRipple="true" disableFocusRipple="true"  className={`${classes.button} + ${classes.sitterButton}`}>
            <Link to='/Signin' className={classes.link}>
              <u>Become a Sitter</u>              
            </Link>            
          </Button>
          <Button size="medium" variant="outlined" className={`${classes.button} + ${classes.login}`}>
            <Link to={'/userlogin'} className={classes.link}>
             Login
            </Link>
          </Button>
          <Button size="medium" className={`${classes.button} + ${classes.signup}`}> 
            <Link to={'/usersignup'} className={classes.link} >
              Sign Up
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}