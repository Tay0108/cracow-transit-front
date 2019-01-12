import React, { Component } from 'react';
import './App.css';
import MapContainer from './components/MapContainer';

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
    setInterval(() => this.getTrams(), 5000);
  }

  getStops() {
    fetch('http://localhost:8080/stopInfo/stops')
      .then(response => response.json())
      .then(stops => this.setState({ stops: stops.stops }));
  }

  getTrams() {
    fetch('http://localhost:8080/vehicleInfo/vehicles')
       .then(response => response.json())
       .then(trams => this.setState({ trams: trams.vehicles }));
  }

  render() {

    function normalizeMarker(obj) {

      if (obj.latitude !== undefined && obj.longitude !== undefined) {
        obj.latitude /= (1000 * 3600);
        obj.longitude /= (1000 * 3600);
      }

      return obj;

    }

    if (this.state.stops === undefined) {
      return ('loading stops...');
    }

    if (this.state.trams === undefined) {
      return ('loading trams...');
    }

    let trams = this.state.trams.map((tram) => normalizeMarker(tram));
    let stops = this.state.stops.map((stop) => normalizeMarker(stop));

    return (
      <div className="App">
        <MapContainer stops={stops} trams={trams}/>
      </div>
    );
  }
}

export default App;
