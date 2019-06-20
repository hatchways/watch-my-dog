import React, { Component, Fragment } from 'react';
import {Link} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles'
import {AppBar, Toolbar} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import dogPaw from '../../static/images/dog-paw.png';
import Avatar from '@material-ui/core/Avatar';


const styles = {
  root: {
    flexGrow: 1,
  },
  navbar:{
    background: 'transparent', 
    boxShadow: 'none'
  },
  menuButton: {
    marginLeft: "1%",
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
    marginRight: "5%",
  },
  login:{
    borderColor: "#e3e3e3",
  },
  signup:{
    backgroundColor: "#f04040",
    marginRight: "5%",
  },
  link:{
    color:"inherit",
    textDecoration:"none",
  },
  avatar: {
    margin: "1%",
    backgroundColor: "white",
  },
};

export default withStyles(styles)(class ButtonAppBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      isAuthenticated : false,
    }
  }

  render(){
    const { classes } = this.props;
    // creating a conditional JSX to render based on whether the user is logged in or not. 
    const navContent = [];
    if(!this.state.isAuthenticated){
      navContent.push(
      <Fragment>
        <Button component={ Link } to="/userlogin" size="medium" variant="outlined" className={`${classes.button} + ${classes.login}`}>
          Login
        </Button>
        <Button component={ Link } to="/usersignup" size="medium" className={`${classes.button} + ${classes.signup}`}> 
            Sign Up
        </Button>
      </Fragment>)
      }
      else if(this.state.isAuthenticated){
        navContent.push(
        <Fragment>
          <Button component={ Link } to="/userlogin" size="medium" variant="outlined" className={`${classes.button} + ${classes.login}`}>
            Messages
          </Button>
          <Button component={ Link } to="/usersignup" size="medium" className={`${classes.button} + ${classes.signup}`}> 
              Profile
          </Button>
      </Fragment>
      )}

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
          <Button component={ Link } to="/signin" size="medium" disableRipple ={true} disableFocusRipple={true}  className={`${classes.button} + ${classes.sitterButton}`}>
              <u>Become a Sitter</u>              
          </Button>
          {navContent}
        </Toolbar>
      </AppBar>
    </div>
  );
  }
})