import React, { Component } from "react";
import "./tram.css";
import { Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import normalizeCoords from "../../util/normalizeCoords";
import API_HOST from "../../API_HOST";

const tramIcon = new L.Icon({
  iconUrl: "/img/tram.svg",
  iconRetinaUrl: "/img/tram.svg",
  iconSize: [25, 25]
});

export default class Tram extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPath: false,
      intervalId: null
    };
    this.displayPath = this.displayPath.bind(this);
    this.getWaypoints = this.getWaypoints.bind(this);
  }

  getWaypoints() {
    fetch(`${API_HOST}/tram/pathInfo/vehicle/${this.props.info.id}`)
      .then(response => response.json())
      .then(path => {
        path = path.paths[0];
        path.wayPoints = path.wayPoints.map(obj => normalizeCoords(obj));
        this.setState({ path });
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
    const tramId = this.props.info.id;
    const tripId = this.props.info.tripId;
    const latitude = this.props.info.latitude;
    const longitude = this.props.info.longitude;
    const name = this.props.info.name;

    return (
      <>
        <Marker
          key={tramId}
          position={[latitude, longitude]}
          icon={tramIcon}
          onClick={() => this.props.onMarkerOpen("tram", tramId, tripId, name)}
       />
        {this.displayPath()}
      </>
    );
  }
}
