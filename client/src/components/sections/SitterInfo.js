import React, { Component} from 'react';
import {Redirect} from 'react-router-dom';
import {
    Grid,
    Paper,
    Avatar,
    Button,
    withStyles
  } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import home from "../../static/images/home.jpg";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

const styles=theme =>({
    root:{
        margin: theme.spacing(15,5,5,5),
        padding: theme.spacing(10)
    },
    profileWrap:{
        padding: theme.spacing(0,10)
    },
    requestWrap:{
        padding: theme.spacing(10)
    },
    profilePhoto: {
        height: 200,
        width: 200,
        marginTop: -100,
        border: "6px solid white"
    },
    media:{
        objectFit: "cover",
        objectPosition: "50% 100%"
    },
    requestbutton: {
        backgroundColor: "#f04040",
        marginTop: "10%",
        color: "#efefef"
      },
})
class SitterInfo extends Component {
    render() {
    const {currentSitter, classes, selectedDate, handleSelectedDate} = this.props
        if(currentSitter.first_name){
            return (
                <div className={classes.root}>
                    <Grid container direction="row">
                        <Grid container item xs={12} sm={12} md={12} className={classes.profileWrap} lg={8} direction="column">
                            <Paper>
                                <Card className={classes.card}>
                                    <CardMedia
                                        component="img"
                                        alt="Contemplative Reptile"
                                        className={classes.media}
                                        height="300"
                                        image={home}
                                        title="Contemplative Reptile"
                                    />
                                    <CardContent>
                                        <Grid
                                            container
                                            justify="center"
                                            alignItems="center"
                                            className={classes.avatarGrid}
                                        >
                                            <Avatar
                                                alt="Remy Sharp"
                                                src={currentSitter.profile_image}
                                                className={classes.profilePhoto}
                                            />
                                        </Grid>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {`${currentSitter.first_name} ${currentSitter.last_name}`}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {currentSitter.location}                                        
                                        </Typography>

                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {currentSitter.about_me}                                        
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Paper>
                        </Grid>
                        <Grid container item spacing={4} xs={12} sm={12} md={12} lg={4}  direction="column">
                            <Paper>
                                <Grid container item 
                                    className={classes.requestWrap}
                                    justify="center"
                                    alignItems="center"
                                >
                                <form
                                    className={classes.container}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <Grid item xs={12}>
                                        <Typography gutterBottom variant="h5" component="h2" align="center">
                                            <strong>{currentSitter.rate}/Day</strong>
                                        </Typography>
                                    </Grid>
                                    <br />
                                        <Grid item xs={12} container  justify="center" alignItems="center" fullwidth="true">
                                            <Typography gutterBottom variant="body2" component="h2" align="left" gutterBottom>
                                                Select Date
                                            </Typography>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <DatePicker
                                                    fullwidth="true"
                                                    openTo="year"
                                                    // name="birthdate"
                                                    inputVariant="outlined"
                                                    format="dd/MM/yyyy"
                                                    views={["year", "month", "date"]}
                                                    value={selectedDate}
                                                    onChange={handleSelectedDate}
                                                />
                                            </MuiPickersUtilsProvider>
                                            <br />
                                        </Grid>
                                        <Grid container item xs={12} justify="center" alignItems="center">
                                            <Button size="large" className={classes.requestbutton} spacing={2} onClick={()=>{alert("request")}}>
                                                Request
                                            </Button>
                                        </Grid>
                                    </form>
                                </Grid>
                            </Paper>
                        </Grid> 
                    </Grid> 
                </div>
            );
        }
        return <Redirect to="/" /> ;
    }
}


export default withStyles(styles)(SitterInfo);