import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    textAlign: "center"
  }
});
export default function ProfilePhoto() {
  const classes = useStyles();
  return (
    <div>
      <h1 className={classes.root}>ProfilePhoto</h1>
    </div>
  );
}
