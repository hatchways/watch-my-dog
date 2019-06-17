import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import dogPaw from '../../static/images/dog-paw.png'


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
    textTransform: "smallcaps"
  },
  signup:{
    backgroundColor: "#f04040",
  }
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.navbar}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu">
          </IconButton>
          <Typography variant="h5" className={classes.title}>
            Lovingsitter
          </Typography>
          <Button size="medium" disableRipple="true" disableFocusRipple="true"  className={`${classes.button} + ${classes.sitterButton}`}><u>Become a Sitter</u></Button>
          <Button size="medium" variant="outlined" className={`${classes.button} + ${classes.login}`}>Login</Button>
          <Button size="medium" className={`${classes.button} + ${classes.signup}`}>Sign Up</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}