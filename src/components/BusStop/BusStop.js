import React, { Component } from "react";
import "./bus-stop.css";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { LocalTime, ChronoUnit } from "js-joda";
import { ClipLoader } from "react-spinners";
import API_HOST from "../../API_HOST";

const stopIcon = new L.Icon({
  iconUrl: "/img/bus-stop.svg",
  iconRetinaUrl: "/img/bus-stop.svg",
  iconSize: [20, 20]
});

export default class BusStop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalId: null
    };
    this.displayPassage = this.displayPassage.bind(this);
    this.getPassages = this.getPassages.bind(this);
    this.showPopup = this.showPopup.bind(this);
  }

  getPassages() {
    fetch(`${API_HOST}/bus/passageInfo/stops/${this.props.info.shortName}`)
      .then(response => response.json())
      .then(passages => {
        passages = passages.actual;
        passages = passages.filter(
          passage =>
            (passage.status =
              "PREDICTED" &&
              passage.actualTime !== null &&
              passage.actualTime !== undefined &&
              passage.plannedTime !== null &&
              passage.plannedTime !== undefined)
        );
        this.setState({ passages: passages });
      });
  }

  displayPassage(passage) {
    let actualTime = LocalTime.parse(passage.actualTime);
    let plannedTime = LocalTime.parse(passage.plannedTime);

    let delay = plannedTime.until(actualTime, ChronoUnit.MINUTES);

    return (
      <li key={passage.passageid}>
        <div className="passage-number">{passage.patternText}</div>w kierunku{" "}
        {passage.direction} o {passage.plannedTime}{" "}
        <span className="delay-text">{delay > 0 ? `(+${delay}min)` : ""}</span>
      </li>
    );
  }

  showPopup() {
    this.getPassages();
    const intervalId = setInterval(() => {
      this.getPassages();
    }, 60000);

    this.setState({ intervalId });
  }

  clearFetchInterval() {
    const intervalId = this.state.intervalId;
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
  }

  hidePopup() {
    this.clearFetchInterval();
  }

  componentWillUnmount() {
    this.clearFetchInterval();
  }

  render() {
    if (this.state.passages === undefined) {
      return (
        <Marker
          position={[this.props.info.latitude, this.props.info.longitude]}
          icon={stopIcon}
          onClick={this.showPopup}
        >
          <Popup className="stop-popup" onClose={this.hidePopup}>
            <ClipLoader />
          </Popup>
        </Marker>
      );
    }

    return (
      <Marker
        position={[this.props.info.latitude, this.props.info.longitude]}
        icon={stopIcon}
        onClick={this.showPopup}
      >
        <Popup className="stop-popup" maxWidth={350}>
          <h2 className="stop-name">{this.props.info.name}</h2>
          <span className="sub-title">
            <br />
          </span>
          <span className="sub-title">Planowe odjazdy:</span>
          <ul className="passages-list">
            {this.state.passages.map(passage => this.displayPassage(passage))}
          </ul>
        </Popup>
      </Marker>
    );
  }
}
