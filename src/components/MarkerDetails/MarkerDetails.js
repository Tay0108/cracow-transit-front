import React, { Component } from "react";
import "./marker-details.css";
import API_HOST from "../../API_HOST";
import { ChronoUnit, LocalTime } from "js-joda";

export default class MarkerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalId: null
    };
    this.getCurrentTramStops = this.getCurrentTramStops.bind(this);
    this.getCurrentTramDelay = this.getCurrentTramDelay.bind(this);

    this.getCurrentBusStops = this.getCurrentBusStops.bind(this);
    this.getCurrentBusDelay = this.getCurrentBusDelay.bind(this);

    this.clearFetchInterval = this.clearFetchInterval.bind(this);
  }

  /* TRAMS */

  getCurrentTramStops() {
    const tripId = this.props.tripId;

    fetch(`${API_HOST}/tram/tripInfo/tripPassages/${tripId}`)
      .then(response => response.json())
      .then(obj => {
        const currentTramStops = obj.actual;

        this.setState({
          currentTramStops
        });

        if (currentTramStops.length > 0) {
          this.setState({
            nextCurrentTramStop: currentTramStops[0].stop.shortName
          });
        }
      });
  }

  getCurrentTramDelay() {
    const tramId = this.props.id;

    console.log("get tram delay");

    fetch(
      `${API_HOST}/tram/passageInfo/stops/${this.state.nextCurrentTramStop}`
    )
      .then(response => response.json())
      .then(passages => {
        const passage = passages.actual.filter(
          passage => passage.vehicleId === tramId
        )[0];

        if (passage != null) {
          const actualTime = LocalTime.parse(passage.actualTime);
          const plannedTime = LocalTime.parse(passage.plannedTime);

          const currentTramDelay = plannedTime.until(
            actualTime,
            ChronoUnit.MINUTES
          );
          this.setState({ currentTramDelay });
        }
      });
  }

  displayTramStop(stop) {
    let time = stop.actualTime;

    if (this.state.delay !== undefined && this.state.delay > 0) {
      time = <span className="delay-text">{time}</span>;
    }

    return (
      <li key={stop.stop_seq_num} className="current-tram-stop">
        <span className="stop-num">{stop.stop_seq_num}</span> {stop.stop.name} (
        {time})
      </li>
    );
  }

  /* END OF TRAMS */

  /* BUSES */

  getCurrentBusStops() {
    const tripId = this.props.tripId;

    fetch(`${API_HOST}/bus/tripInfo/tripPassages/${tripId}`)
      .then(response => response.json())
      .then(obj => {
        const currentBusStops = obj.actual;

        this.setState({
          currentBusStops
        });

        if (currentBusStops.length > 0) {
          this.setState({
            nextCurrentBusStop: currentBusStops[0].stop.shortName
          });
        }
      });
  }

  getCurrentBusDelay() {
      console.log("getting bus delay");

    fetch(`${API_HOST}/bus/passageInfo/stops/${this.state.nextCurrentBusStop}`)
      .then(response => response.json())
      .then(passages => {
        const passage = passages.actual.filter(
          passage => passage.vehicleId === this.props.info.id
        )[0];

        if (passage != null) {
          const actualTime = LocalTime.parse(passage.actualTime);
          const plannedTime = LocalTime.parse(passage.plannedTime);

          const currentBusDelay = plannedTime.until(
            actualTime,
            ChronoUnit.MINUTES
          );
          this.setState({ currentBusDelay });
        }
      });
  }

  displayBusStop(stop) {
    let time = stop.actualTime;

    if (this.state.delay !== undefined && this.state.delay > 0) {
      time = <span className="delay-text">{time}</span>;
    }

    return (
      <li key={stop.stop_seq_num} className="current-bus-stop">
        <span className="stop-num">{stop.stop_seq_num}</span> {stop.stop.name} (
        {time})
      </li>
    );
  }

  componentDidMount() {
    switch (this.props.type) {
      case "tram": {
        this.setState({ showPath: true });
        //this.getWaypoints();
        this.getCurrentTramStops();
        if (this.state.nextCurrentTramStop !== undefined) {
          this.getCurrentTramDelay();
        }
        const intervalId = setInterval(() => {
          this.getCurrentTramStops();
          if (this.state.nextCurrentTramStop !== undefined) {
            this.getCurrentTramDelay();
          }


        }, 7000);

        this.setState({ intervalId });
        break;
      }
      case "bus":
        {
          this.setState({ showPath: true });
          // this.getWaypoints();
          this.getCurrentBusStops();
          if (this.state.nextCurrentBusStop !== undefined) {
            this.getCurrentBusDelay();
          }
          const intervalId = setInterval(() => {
            this.getCurrentBusStops();
            if (this.state.nextStop !== undefined) {
              this.getCurrentBusDelay();
            }
          }, 7000);

          this.setState({ intervalId });
        }
        break;
      case "tram_stop":
        {
        }
        break;
      case "bus_stop":
        {
        }
        break;
      default:
        break;
    }
  }

  clearFetchInterval() {
    const intervalId = this.state.intervalId;
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
  }

  componentWillUnmount() {
    this.clearFetchInterval();
  }

  render() {
    const type = this.props.type;

    switch (type) {
      case "tram": {
        let delay = "obliczam...";

        if (this.state.currentTramDelay !== undefined) {
          delay = this.state.currentTramDelay;

          if (delay > 0) {
            delay = <span className="delay-text">{delay} min</span>;
          } else {
            delay = <span className="nodelay-text">brak</span>;
          }
        }

        if (this.state.currentTramStops === undefined) {
          return "loading tram";
        }

        return (
          <div className="marker-details">
            <button className="close-details" onClick={this.props.onClose}>
              X
            </button>
            <h2 className="tram-name">{this.props.name}</h2>
            <span className="sub-title">
              Opóźnienie: {delay}
              <br />
            </span>
            <span className="sub-title">
              <br />
            </span>
            <span className="sub-title">Kolejne przystanki:</span>
            <ul className="stops-list">
              {this.state.currentTramStops.map(stop =>
                this.displayTramStop(stop)
              )}
            </ul>
          </div>
        );
      }
      case "bus": {
        if (this.state.currentBusStops === undefined) {
          return "loading bus";
        }

        let delay = "obliczam...";

        if (this.state.delay !== undefined) {
          delay = this.state.currentBusDelay;

          delay =
            delay > 0 ? (
              <span className="delay-text">{delay} min</span>
            ) : (
              <span className="nodelay-text">brak</span>
            );
        }

        return (
          <div className="marker-details">
            <h2 className="bus-name">{this.props.name}</h2>
            <span className="sub-title">
              Opóźnienie: {delay}
              <br />
            </span>
            <span className="sub-title">
              <br />
            </span>
            <span className="sub-title">Kolejne przystanki:</span>
            <ul className="stops-list">
              {this.state.currentBusStops.map(stop =>
                this.displayBusStop(stop)
              )}
            </ul>
          </div>
        );
      }
      case "tram_stop":
        {
        }
        break;
      case "bus_stop":
        {
        }
        break;

      default:
        break;
    }
  }
}
