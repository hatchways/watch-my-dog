import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Link} from '@material-ui/core';
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
          <Button size="medium" className={`${classes.button} + ${classes.signup}`}> 
            <Link href={'/Signup'} className={classes.link}  color= "inherit" underline="none">
              Sign Up
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}