import React  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';

// A theme based styling for Material UI
const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
    webpages:{
        flexGrow: 1
    },
    link:{
        marginLeft: theme.spacing(4),
        color: "white",
        textDecoration: "none",

    }
  }));

export default function Nav (props) {
        const classes = useStyles();
        return (
            <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                WatchMyDog
              </Typography>
              <Typography variant="h6" className={classes.webpages}>
                  <Link to={"/"} className={classes.link}>
                    Home
                  </Link>
                  <Link to={"/landingpage"} className={classes.link}>
                    Profile
                  </Link>
              </Typography>
              {/* <Button color="inherit">Login</Button>
              <Button color="inherit">Signup</Button> */}
            </Toolbar>
          </AppBar>      
        )
}
