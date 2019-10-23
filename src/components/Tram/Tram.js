import React, { Component } from "react";
import "./tram.css";
import { Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import { ClipLoader } from "react-spinners";
import { ChronoUnit, LocalTime } from "js-joda";
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
    this.normalizeCoords = this.normalizeCoords.bind(this);
    this.displayPath = this.displayPath.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.hidePopup = this.hidePopup.bind(this);
    this.getWaypoints = this.getWaypoints.bind(this);
    this.getStops = this.getStops.bind(this);
    this.getDelay = this.getDelay.bind(this);
    this.clearFetchInterval = this.clearFetchInterval.bind(this);
  }

  getWaypoints() {
    fetch(`${API_HOST}/tram/pathInfo/vehicle/${this.props.info.id}`)
      .then(response => response.json())
      .then(path => {
        path = path.paths[0];
        path.wayPoints = path.wayPoints.map(obj => this.normalizeCoords(obj));
        this.setState({ path: path });
      });
  }

  getStops() {
    fetch(`${API_HOST}/tram/tripInfo/tripPassages/${this.props.info.tripId}`)
      .then(response => response.json())
      .then(obj => {
        const stops = obj.actual;

        this.setState({
          stops
        });

        if (stops.length > 0) {
          this.setState({ nextStop: stops[0].stop.shortName });
        }
      });
  }

  getDelay() {
    fetch(`${API_HOST}/tram/passageInfo/stops/${this.state.nextStop}`)
      .then(response => response.json())
      .then(passages => {
        let passage = passages.actual.filter(
          passage => passage.vehicleId === this.props.info.id
        )[0];

        if (passage != null) {
          let actualTime = LocalTime.parse(passage.actualTime);
          let plannedTime = LocalTime.parse(passage.plannedTime);

          let delay = plannedTime.until(actualTime, ChronoUnit.MINUTES);
          this.setState({ delay });
        }
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

  showPopup() {
    this.setState({ showPath: true });
    this.getWaypoints();
    this.getStops();
    if (this.state.nextStop !== undefined) {
      this.getDelay();
    }
    const intervalId = setInterval(() => {
      this.getStops();
      if (this.state.nextStop !== undefined) {
        this.getDelay();
      }
    }, 3000);

    this.setState({ intervalId });
  }

  clearFetchInterval() {
    const intervalId = this.state.intervalId;
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
  }

  hidePopup() {
    this.setState({ showPath: false });
    this.clearFetchInterval();
  }

  displayStop(stop) {
    let time = stop.actualTime;

    if (this.state.delay !== undefined && this.state.delay > 0) {
      time = <span className="delay-text">{time}</span>;
    }

    return (
      <li key={stop.stop_seq_num}>
        <span className="stop-num">{stop.stop_seq_num}</span> {stop.stop.name} (
        {time})
      </li>
    );
  }

  normalizeCoords(obj) {
    if (obj.lat !== undefined && obj.lon !== undefined) {
      obj.lat /= 1000.0 * 3600.0;
      obj.lon /= 1000.0 * 3600.0;
    }
    return obj;
  }

  componentWillUnmount() {
    this.clearFetchInterval();
  }

  render() {
    if (this.state.path === undefined || this.state.stops === undefined) {
      return (
        <Marker
          key={this.props.info.id}
          position={[this.props.info.latitude, this.props.info.longitude]}
          icon={tramIcon}
          onClick={this.showPopup}
        >
          <Popup>
            <ClipLoader />
          </Popup>
        </Marker>
      );
    }

    let delay = "obliczam...";

    if (this.state.delay !== undefined) {
      delay = this.state.delay;

      if (delay > 0) {
        delay = <span className="delay-text">{delay} min</span>;
      } else {
        delay = <span className="nodelay-text">brak</span>;
      }
    }

    return (
      <>
        <Marker
          key={this.props.info.id}
          position={[this.props.info.latitude, this.props.info.longitude]}
          icon={tramIcon}
          onClick={this.showPopup}
        >
          <Popup onClose={this.hidePopup}>
            <h2 className="tram-name">{this.props.info.name}</h2>
            <span className="sub-title">
              Opóźnienie: {delay}
              <br />
            </span>
            <span className="sub-title">
              <br />
            </span>
            <span className="sub-title">Kolejne przystanki:</span>
            <ul className="stops-list">
              {this.state.stops.map(stop => this.displayStop(stop))}
            </ul>
          </Popup>
        </Marker>
        {this.displayPath()}
      </>
    );
  }
}
