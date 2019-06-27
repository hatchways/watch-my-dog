import React from "react";
import Typography from "@material-ui/core/Typography";
import { Grid, Avatar, Button } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/styles";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles(theme =>
  createStyles({
    text: {
      textAlign: "center"
    },
    avatarGrid: {
      margin: theme.spacing(5, 0)
    },
    profilePhoto: {
      height: 200,
      width: 200,
      marginBottom: theme.spacing(5)
    },
    upload_button: {
      color: theme.primary,
      borderColor: theme.primary
    },
    margin: {
      margin: theme.spacing(2, 0)
    },
    input: {
      display: "none"
    }
  })
);
export default function ProfilePhoto(props) {
  const classes = useStyles();
  const uploadPhoto = e => {
    e.preventDefault();
    props.uploadPhoto(e);
  };
  return (
    <div>
      <Typography variant="h4" className={classes.text} gutterBottom>
        Profile Photo
      </Typography>
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.avatarGrid}
      >
        <Avatar
          alt="Remy Sharp"
          src={props.profile_data.profile_image}
          className={classes.profilePhoto}
        />
      </Grid>
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.margin}
      >
        <input
          accept="image/*"
          className={classes.input}
          id="contained-button-file"
          multiple
          type="file"
          onChange={uploadPhoto}
        />
        <label htmlFor="contained-button-file">
          <Button
            variant="outlined"
            component="span"
            className={classes.upload_button}
          >
            Upload a file from your device
          </Button>
        </label>
      </Grid>
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.margin}
      >
        <Button className={classes.button}>
          <DeleteIcon fontSize="large" />
          Delete Photo
        </Button>{" "}
      </Grid>
    </div>
  );
}
