import React, { Component } from "react";
import "./App.css";
import MapContainer from "./components/MapContainer/MapContainer";
import { BarLoader } from "react-spinners";
import API_HOST from "./API_HOST";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayBuses: true,
      displayBusStops: false,
      displayTrams: false,
      displayTramStops: false
    };
    this.normalizeMarker = this.normalizeMarker.bind(this);
    this.getTramStops = this.getTramStops.bind(this);
    this.getTrams = this.getTrams.bind(this);
    this.getBusStops = this.getBusStops.bind(this);
    this.getBuses = this.getBuses.bind(this);
    this.toggleDisplayBusStops = this.toggleDisplayBusStops.bind(this);
    this.toggleDisplayBuses = this.toggleDisplayBuses.bind(this);
    this.toggleDisplayTramStops = this.toggleDisplayTramStops.bind(this);
    this.toggleDisplayTrams = this.toggleDisplayTrams.bind(this);
  }

  componentDidMount() {
    this.getTramStops();
    this.getBusStops();
    this.getTrams();
    this.getBuses();
    setInterval(() => {
      this.getTrams();
      this.getBuses();
    }, 7000);
  }

  normalizeMarker(obj) {
    if (obj.latitude !== undefined && obj.longitude !== undefined) {
      obj.latitude /= 1000.0 * 3600.0;
      obj.longitude /= 1000.0 * 3600.0;
    }
    return obj;
  }

  getTramStops() {
    fetch(`${API_HOST}/tram/stopInfo/stops`)
      .then(response => response.json())
      .then(tramStops => {
        tramStops = tramStops.stops.filter(stop => stop.category === "tram");
        tramStops = tramStops.map(stop => this.normalizeMarker(stop));
        this.setState({ tramStops });
      });
  }

  getTrams() {
    fetch(`${API_HOST}/tram/vehicleInfo/vehicles`)
      .then(response => response.json())
      .then(trams => {
        if (trams.status === 500) {
          this.setState({ trams: [] });
          return;
        }
        trams = trams.vehicles.filter(
          tram =>
            !tram.deleted &&
            tram.latitude !== undefined &&
            tram.longitude !== undefined
        );
        trams = trams.map(tram => this.normalizeMarker(tram));
        this.setState({ trams: trams });
      });
  }

  getBusStops() {
    fetch(`${API_HOST}/bus/stopInfo/stops`)
      .then(response => response.json())
      .then(busStops => {
        busStops = busStops.stops.filter(stop => stop.category === "bus");
        busStops = busStops.map(stop => this.normalizeMarker(stop));
        this.setState({ busStops });
      });
  }

  getBuses() {
    fetch(`${API_HOST}/bus/vehicleInfo/vehicles`)
      .then(response => response.json())
      .then(buses => {
        if (buses.status === 500) {
          this.setState({ buses: [] });
          return;
        }
        buses = buses.vehicles.filter(
          bus =>
            !bus.deleted &&
            bus.latitude !== undefined &&
            bus.longitude !== undefined
        );
        buses = buses.map(tram => this.normalizeMarker(tram));
        this.setState({ buses });
      });
  }

  toggleDisplayBusStops(event) {
    this.setState({
      displayBusStops: event.target.checked
    });
  }

  toggleDisplayBuses(event) {
    this.setState({
      displayBuses: event.target.checked
    });
  }

  toggleDisplayTramStops(event) {
    this.setState({
      displayTramStops: event.target.checked
    });
  }

  toggleDisplayTrams(event) {
    this.setState({
      displayTrams: event.target.checked
    });
  }

  render() {
    if (
      this.state.tramStops === undefined ||
      this.state.trams === undefined ||
      this.state.buses === undefined
    ) {
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

    const trams = this.state.trams;
    const tramStops = this.state.tramStops;
    const busStops = this.state.busStops;
    const buses = this.state.buses;

    return (
      <div className="App">
        <form className="map-options">
          <label>
            Display bus stops:
            <input
              type="checkbox"
              checked={this.state.displayBusStops}
              onChange={this.toggleDisplayBusStops}
            />
          </label>
          <label>
            Display buses:
            <input
              type="checkbox"
              checked={this.state.displayBuses}
              onChange={this.toggleDisplayBuses}
            />
          </label>
          <label>
            Display tram stops:
            <input
              type="checkbox"
              checked={this.state.displayTramStops}
              onChange={this.toggleDisplayTramStops}
            />
          </label>
          <label>
            Display trams:
            <input
              type="checkbox"
              checked={this.state.displayTrams}
              onChange={this.toggleDisplayTrams}
            />
          </label>
        </form>
        <MapContainer
          tramStops={this.state.displayTramStops ? tramStops : []}
          trams={this.state.displayTrams ? trams : []}
          busStops={this.state.displayBusStops ? busStops : []}
          buses={this.state.displayBuses ? buses : []}
        />
      </div>
    );
  }
}

export default App;
