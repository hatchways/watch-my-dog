import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Homepage from "./components/webpages/Homepage";

export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route
            path="/"
            render={props => {
              return <Homepage {...props} upath={props.history} />;
            }}
          />
        </Switch>
      </Router>
    );
  }
}
