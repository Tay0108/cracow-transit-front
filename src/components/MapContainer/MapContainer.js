import React, { Component } from "react";
import { Map, TileLayer } from "react-leaflet";
import "./map-container.css";
import TramStop from "../TramStop/TramStop";
import Tram from "../Tram/Tram";
import Bus from "../Bus/Bus";
import BusStop from "../BusStop/BusStop";
import MarkerClusterGroup from "react-leaflet-markercluster";

export default class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 50.0613888889,
      lng: 19.9383333333,
      zoom: 13
    };
  }

  displayTramStop(tramStop) {
    return (
      <TramStop
        key={tramStop.id}
        info={tramStop}
        onMarkerOpen={this.props.onMarkerOpen}
        onMarkerClose={this.props.onMarkerClose}
      />
    );
  }

  displayTram(tram) {
    return (
      <Tram
        key={tram.id}
        info={tram}
        onMarkerOpen={this.props.onMarkerOpen}
        onMarkerClose={this.props.onMarkerClose}
      />
    );
  }

  displayBusStop(busStop) {
    return (
      <BusStop
        key={busStop.id}
        info={busStop}
        onMarkerOpen={this.props.onMarkerOpen}
        onMarkerClose={this.props.onMarkerClose}
      />
    );
  }

  displayBus(bus) {
    return (
      <Bus
        key={bus.id}
        info={bus}
        onMarkerOpen={this.props.onMarkerOpen}
        onMarkerClose={this.props.onMarkerClose}
      />
    );
  }

  render() {
    const position = [this.state.lat, this.state.lng];

    return (
      <Map center={position} zoom={this.state.zoom} maxZoom={18}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {this.props.clustering ? (
          <>
            <MarkerClusterGroup
              showCoverageOnHover={false}
              disableClusteringAtZoom={15}
              spiderfyOnMaxZoom={false}
            >
              {this.props.tramStops.map(stop => this.displayTramStop(stop))}
              {this.props.trams.map(tram => this.displayTram(tram))}
              {this.props.busStops.map(stop => this.displayBusStop(stop))}
              {this.props.buses.map(bus => this.displayBus(bus))}
            </MarkerClusterGroup>
          </>
        ) : (
          <>
            {this.props.tramStops.map(stop => this.displayTramStop(stop))}
            {this.props.trams.map(tram => this.displayTram(tram))}
            {this.props.busStops.map(stop => this.displayBusStop(stop))}
            {this.props.buses.map(bus => this.displayBus(bus))}
          </>
        )}
      </Map>
    );
  }
}
