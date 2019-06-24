import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    color: "red",
    marginTop: "50%"
  }
});
export default function Payments() {
  const classes = useStyles();
  return (
    <div>
      <h1 className={classes.root}>Helloooooo</h1>
    </div>
  );
}
