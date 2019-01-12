import React, { Component } from 'react';
import './App.css';
import MapContainer from './components/MapContainer';

class App extends Component {

  constructor() {
    super();
    this.state = {};
    this.normalizeMarker = this.normalizeMarker.bind(this);
    this.getStops = this.getStops.bind(this);
    this.getTrams = this.getTrams.bind(this);
  }

  componentDidMount() {
    this.getStops();
    this.getTrams();
    setInterval(() => this.getTrams(), 10000);
  }

  normalizeMarker(obj) {
    if (obj.latitude !== undefined && obj.longitude !== undefined) {
      obj.latitude /= (1000.0 * 3600.0);
      obj.longitude /= (1000.0 * 3600.0);
    }

    return obj;
  }

  getStops() {
    fetch('http://localhost:8080/stopInfo/stops')
      .then(response => response.json())
      .then(stops => {
        stops = stops.stops.filter(stop => stop.category === 'tram');
        stops = stops.map((stop) => this.normalizeMarker(stop));
        this.setState({ stops: stops })
      });
  }

  getTrams() {
    fetch('http://localhost:8080/vehicleInfo/vehicles')
      .then(response => response.json())
      .then(trams => {
        trams = trams.vehicles.filter((tram) => (!tram.deleted && tram.latitude !== undefined && tram.longitude !== undefined));
        trams = trams.map((tram) => this.normalizeMarker(tram));
        this.setState({ trams: trams });
      });
  }

  render() {

    if (this.state.stops === undefined) {
      return ('loading stops...');
    }

    if (this.state.trams === undefined) {
      return ('loading trams...');
    }

    let trams = this.state.trams;
    let stops = this.state.stops;

    return (
      <div className="App">
        <MapContainer stops={stops} trams={trams} />
      </div>
    );
  }
}

export default App;
