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
  primary: "#f04040",
  secondary: "#1f1f1f",
  error: "#d8000c",
  bgcolor: "#f6f6f6",
  light: "#b3b3b3"
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
