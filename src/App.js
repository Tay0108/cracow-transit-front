import React, { Component } from 'react';
import './App.css';
import Container from './components/Container';

class App extends Component {

  constructor() {
    super();
    this.state = {};
    this.getStops = this.getStops.bind(this);
    this.getTrams = this.getTrams.bind(this);
  }

  componentDidMount() {
    this.getStops();
    this.getTrams();
    //setInterval(() => this.getTrams(), 5000)
  }

  getStops() {
    fetch('http://localhost:8080/stopInfo/stops')
      .then(response => response.json())
      .then(stops => this.setState({ stops: stops.stops }));
  }
  getTrams() {
    setInterval(() => fetch('http://localhost:8080/vehicleInfo/vehicles')
      .then(response => response.json())
      .then(trams => this.setState({ trams: trams.vehicles })), 5000);
  }

  render() {

    function normalizeMarker(obj) {
      obj.latitude /= (1000 * 3600);
      obj.longitude /= (1000 * 3600);

      return obj;
    }

    if (this.state.stops === undefined) {
      return ('loading stops...');
    }
    if (this.state.trams === undefined) {
      return ('loading trams...');
    }

    let stops = this.state.stops.map((stop) => normalizeMarker(stop));
    let trams = this.state.trams.map((tram) => normalizeMarker(tram));

    return (
      <div className="App">
        <Container stops={stops} trams={trams} />
      </div>
    );
  }
}

export default App;
