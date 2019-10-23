import React, { Component } from "react";
import "./bus.css";
import { Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import API_HOST from "../../API_HOST";
import normalizeCoords from "../../util/normalizeCoords";

const busIcon = new L.Icon({
  iconUrl: "/img/bus.svg",
  iconRetinaUrl: "/img/bus.svg",
  iconSize: [25, 25]
});

export default class Bus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPath: false
    };
    this.displayPath = this.displayPath.bind(this);
    this.getWaypoints = this.getWaypoints.bind(this);
  }

  getWaypoints() {
    fetch(`${API_HOST}/bus/pathInfo/vehicle/${this.props.info.id}`)
      .then(response => response.json())
      .then(path => {
        path = path.paths[0];
        let wayPoints = path.wayPoints.map(obj => normalizeCoords(obj));
        path.wayPoints = wayPoints;
        this.setState({ path: path });
      });
  }

  displayPath() {
    if (this.state.path === undefined || this.state.stops === undefined) {
      return "";
    }
    if (this.state.showPath) {
      return (
        <Polyline
          positions={this.state.path.wayPoints}
          color={"#4286f4"}
          weight={5}
        />
      );
    }
    return "";
  }

  //this.setState({ showPath: false });

  render() {

    const busId = this.props.info.id;
    const tripId = this.props.info.tripId;
    const latitude = this.props.info.latitude;
    const longitude = this.props.info.longitude;
    const name = this.props.info.name;

    return (
      <>
        <Marker
          key={busId}
          position={[latitude, longitude]}
          icon={busIcon}
          onClick={() => this.props.onMarkerOpen("bus", busId, tripId, name)}
        />
        {this.displayPath()}
      </>
    );
  }
}
