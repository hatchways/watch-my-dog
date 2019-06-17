import React, {Component} from 'react';
import './App.css';
import Nav from './components/styling/Nav';
import Home from './components/webpages/Home';


export default class App extends Component {


  render(){
    return (
        <div className="App">
          <Nav />
          <Home />
        </div>
    );
  }
}

