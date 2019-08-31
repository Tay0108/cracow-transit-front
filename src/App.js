import React, { Component } from 'react';
import './App.css';
import MapContainer from './components/MapContainer';
import { BarLoader } from 'react-spinners';

class App extends Component {

  constructor() {
    super();
    this.state = {};
    this.normalizeMarker = this.normalizeMarker.bind(this);
    this.getTramStops = this.getTramStops.bind(this);
    this.getTrams = this.getTrams.bind(this);
  }

  componentDidMount() {
    this.getTramStops();
    this.getTrams();
    setInterval(() => this.getTrams(), 5000);
  }

  normalizeMarker(obj) {
    if (obj.latitude !== undefined && obj.longitude !== undefined) {
      obj.latitude /= (1000.0 * 3600.0);
      obj.longitude /= (1000.0 * 3600.0);
    }

    return obj;
  }

  getTramStops() {
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
        if(trams.status === 500) {
          this.setState({trams: []});
          return;
        }
        trams = trams.vehicles.filter((tram) => (!tram.deleted && tram.latitude !== undefined && tram.longitude !== undefined));
        trams = trams.map((tram) => this.normalizeMarker(tram));
        this.setState({ trams: trams });
      });
  }

  getBusStops() {

  }

  getBuses() {

  }

  render() {
    if (this.state.stops === undefined || this.state.trams === undefined) {
      return (
        <div className="loader-wrapper">
          <div className="loader-box">
            <img src="img/tram.svg" alt="App logo" className="app-logo" />
            <div>
              <h1 className="app-title">Cracow Trams</h1>
              <BarLoader widthUnit={"%"} width={100} />
            </div>
          </div>
        </div>
      );
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
