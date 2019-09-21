import React, { Component} from 'react';
import {Redirect} from 'react-router-dom';
import {
    Grid,
    Paper,
    Avatar,
    withStyles,
    CardContent, Button,CardMedia
  } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import home from "../../static/images/home.jpg";
import SearchGridItems from "../styling/SearchGridItems"
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

const styles=theme =>({
    root:{
        margin: theme.spacing(15,5,5,5),
        padding: theme.spacing(10)
    },
    profileWrap:{
        padding: theme.spacing(2,10)
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
    recommended:{
        marginTop: theme.spacing(10)
    }
})
class SitterInfo extends Component {
    render() {
    const {currentSitter, classes, selectedDate, handleSelectedDate, users, routeTo} = this.props
    const gridJSX = users.forEach((value, index)=>{
        if(value.email !== currentSitter.email){
            return <SearchGridItems 
                    key = {index}
                    value = {value}
                    routeTo= {()=>{routeTo(index)}}
                />
        }
    });
        if(currentSitter.first_name){
            return (
                <div className={classes.root}>
                    <Grid container direction="row">
                        <Grid container item xs={12} sm={12} md={12} lg={8} className={classes.profileWrap}  direction="column">
                            <Paper>
                                <Card item className={classes.card}>
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
                                        <Typography gutterBottom variant="h5" component="h2" align="center">
                                            {`${currentSitter.first_name} ${currentSitter.last_name}`}
                                        </Typography>
                                        <Typography gutterBottom variant="body1" color="textSecondary" component="p">
                                            {currentSitter.location}                                        
                                        </Typography>

                                        <Typography gutterBottom variant="body1" color="textPrimary" component="p">
                                            {currentSitter.about_me}                                        
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Paper>
                        </Grid>
                        <Grid container item xs={12} sm={12} md={12} lg={4} className={classes.profileWrap} direction="column">
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
                                            <Typography gutterBottom variant="body2" component="h2" align="left">
                                                Select Date
                                            </Typography>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <DatePicker
                                                    fullwidth="true"
                                                    openTo="year"
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
                                            <Button size="large" className={classes.requestbutton} spacing={2} onClick={()=>{alert("request sent")}}>
                                                Request
                                            </Button>
                                        </Grid>
                                    </form>
                                </Grid>
                            </Paper>
                        </Grid> 
                        <Grid container item xs={12} sm={12} md={12} lg={12} className={classes.profileWrap} justify="center" >
                            <Typography gutterBottom variant="h6" component="h2" >
                                <strong>Other Recommended Sitters</strong>
                            </Typography>
                        </Grid>
                        <Grid container item xs={12} sm={12} md={12} lg={12} className={classes.profileWrap}>
                            <Grid container justify="center" spacing={10}>
                                {gridJSX}
                            </Grid>
                        </Grid>
                    </Grid> 
                </div>
            );
        }
        return <Redirect to="/" /> ;
    }
}


export default withStyles(styles)(SitterInfo);