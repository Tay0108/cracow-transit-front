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
    //this.setState({stops: this.state.stops.map((stop) => this.normalizeMarker(stop))});
    this.getTrams();
    //this.setState({trams: this.state.trams.map((tram) => this.normalizeMarker(tram))});
    setInterval(() => this.getTrams(), 5000);
    //this.setState({trams: this.state.trams.map((tram) => this.normalizeMarker(tram))});
  }

  
  normalizeMarker(obj) {

    if (obj.latitude !== undefined && obj.longitude !== undefined) {
      obj.latitude /= (1000 * 3600);
      obj.longitude /= (1000 * 3600);
    }

    return obj;

  }

  getStops() {
    fetch('http://localhost:8080/stopInfo/stops')
      .then(response => response.json())
      .then(stops => {
        stops = stops.stops.map((stop) => this.normalizeMarker(stop));
        this.setState({ stops: stops })
      });
  }

  getTrams() {
    fetch('http://localhost:8080/vehicleInfo/vehicles')
       .then(response => response.json())
       .then(trams => 
        {
          trams = trams.vehicles.map((tram) => this.normalizeMarker(tram));
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
        <MapContainer stops={stops} trams={trams}/>
      </div>
    );
  }
}

export default App;
