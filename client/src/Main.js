import React, { Component } from "react";
import App from "./App";
import "./App.css";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "../src/react_dates_overrides.css"

const theme = createMuiTheme({
  typography: {
    fontFamily: '"Gilroy"'
  },
  palette:{
    primary:{
      main: "#07C48E"
    },
    secondary: {
      main:"#1f1f1f"
    },
    error: {
      main: "#d8000c"
    },
    bgcolor: {
      main: "#f6f6f6"
    },
    light: {
      main: "#b3b3b3"
    }
  },
});

export default class Main extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    );
  }
}
