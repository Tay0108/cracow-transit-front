import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      vehicles : []
    };
  }

  componentDidMount() {
    fetch('https://mpk.jacekk.net/proxy.php/services/tripInfo/tripPassages?tripId=6351558574047093766&mode=departure' ,{mode: 'no-cors'})
    .then(result => result.json())
    .then(json => this.setState({vehicles: json}));
  }

  render() {
    console.log(this.state.vehicles);
    return (
      <div className="App">

      {this.state.vehicles}
      
      </div>
    );
  }
}

export default App;
