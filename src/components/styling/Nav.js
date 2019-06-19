import React, { Component, Fragment } from 'react';
import {Link} from 'react-router-dom';
// import { makeStyles } from '@material-ui/core/styles';
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
      isAuthenticated : true,
    }
  }

  render(){
    const { classes } = this.props;
    const navContent = [];
    if(!this.state.isAuthenticated){
      navContent.push(
      <Fragment>
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
      </Fragment>)
      }
      else if(this.state.isAuthenticated){
        navContent.push(
        <Fragment>
          <Button size="medium" variant="outlined" className={`${classes.button} + ${classes.login}`}>
          <Link to={'/userlogin'} className={classes.link}>
            Messages
          </Link>
        </Button>
        <Button size="medium" className={`${classes.button} + ${classes.signup}`}> 
          <Link to={'/usersignup'} className={classes.link} >
            Profile
          </Link>
        </Button>
      </Fragment>
      )}
      console.log(this.state.isAuthenticated);
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
          {navContent}
        </Toolbar>
      </AppBar>
    </div>
  );
  }
})