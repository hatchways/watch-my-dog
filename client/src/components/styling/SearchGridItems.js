import React, { Component } from 'react'
import { Grid, Card, Typography, CardContent, CardActions, Avatar, Divider, CardActionArea} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import LocationIcon from "@material-ui/icons/LocationOn";

const styles = theme=>({
    location:{
        color: theme.palette.primary.main
    },
    card:{
        padding: theme.spacing(0, 2)
    },
    profilePhoto: {
        height: 100,
        width: 100,
    },
    
})
class SearchGridItems extends Component {
    render() {
        const { classes, key, value, routeTo} = this.props;

        return (
            <Grid key={key} item xs={12} sm={6} md={6} lg={4}>
                <Card className={classes.card} onClick={()=>routeTo(key)}>
                <CardActionArea>
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
                    </Grid>
                    <Typography variant="body1" color="textPrimary" noWrap component="p" align="center">
                        {value.about_me}
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
                            <strong>${value.rate}/day</strong>
                        </Typography>
                        </Grid>
                    </Grid>
                    </CardActions>
                </CardActionArea>
                </Card>              
            </Grid>
        )
    }
}

export default withStyles(styles)(SearchGridItems)