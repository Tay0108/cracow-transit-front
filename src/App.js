import React, { Component } from "react";
import "./App.css";
import MapContainer from "./components/MapContainer/MapContainer";
import { BarLoader } from "react-spinners";
import API_HOST from "./API_HOST";
import MarkerDetails from "./components/MarkerDetails/MarkerDetails";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayBuses: false,
      displayBusStops: false,
      displayTrams: true,
      displayTramStops: false,
      clustering: true,
      markerOpen: false,
      markerObjectType: null,
      markerObjectId: null,
      markerObjectName: "",
      markerTripId: null
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
    this.toggleClustering = this.toggleClustering.bind(this);
    this.openMarkerDetails = this.openMarkerDetails.bind(this);
    this.closeMarkerDetails = this.closeMarkerDetails.bind(this);
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

  toggleClustering(event) {
    this.setState({
      clustering: event.target.checked
    });
  }

  openMarkerDetails(type, id, tripId, name) {
    console.log("opening marker details");
    this.setState({
      markerOpen: true,
      markerObjectType: type,
      markerObjectId: id,
      markerTripId: tripId,
      markerObjectName: name
    });
  }

  closeMarkerDetails() {
    console.log("closing marker details");
    this.setState({
      markerOpen: false,
      markerObjectType: null,
      markerObjectId: null,
      markerTripId: null,
      markerObjectName: null
    });
  }

  render() {
    if (
      this.state.tramStops === undefined ||
      this.state.trams === undefined ||
      this.state.busStops === undefined ||
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
          <label className="option">
            Pokaż przystanki autobusowe:
            <input
              type="checkbox"
              checked={this.state.displayBusStops}
              onChange={this.toggleDisplayBusStops}
            />
          </label>
          <label className="option">
            Pokaż autobusy:
            <input
              type="checkbox"
              checked={this.state.displayBuses}
              onChange={this.toggleDisplayBuses}
            />
          </label>
          <label className="option">
            Pokaż przystanki tramwajowe:
            <input
              type="checkbox"
              checked={this.state.displayTramStops}
              onChange={this.toggleDisplayTramStops}
            />
          </label>
          <label className="option">
            Pokaż tramwaje:
            <input
              type="checkbox"
              checked={this.state.displayTrams}
              onChange={this.toggleDisplayTrams}
            />
          </label>
          <label className="option">
            Włącz klasteryzację:
            <input
              type="checkbox"
              checked={this.state.clustering}
              onChange={this.toggleClustering}
            />
          </label>
        </form>
        {this.state.markerOpen ? (
          <MarkerDetails
            onClose={this.closeMarkerDetails}
            type={this.state.markerObjectType}
            id={this.state.markerObjectId}
            tripId={this.state.markerTripId}
            name={this.state.markerObjectName}
          />
        ) : (
          ""
        )}
        <MapContainer
          tramStops={this.state.displayTramStops ? tramStops : []}
          trams={this.state.displayTrams ? trams : []}
          busStops={this.state.displayBusStops ? busStops : []}
          buses={this.state.displayBuses ? buses : []}
          clustering={this.state.clustering}
          onMarkerOpen={this.openMarkerDetails}
          onMarkerClose={this.closeMarkerDetails}
        />
      </div>
    );
  }
}

export default App;
