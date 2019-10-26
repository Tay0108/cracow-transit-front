import React, { useState, useEffect } from "react";
import "./marker-details.css";
import API_HOST from "../../API_HOST";
import { ChronoUnit, LocalTime } from "js-joda";
import normalizeCoords from "../../util/normalizeCoords";
import { Polyline, Popup } from "react-leaflet";

export default function MarkerDetails({
  id,
  name,
  tripId,
  type,
  onClose,
  onOpen
}) {
  const [intervalId, setIntervalId] = useState(null);

  const [showTramPath, setShowTramPath] = useState(false); // TODO
  const [tramPath, setTramPath] = useState(undefined);

  const [showBusPath, setShowBusPath] = useState(false); // TODO
  const [busPath, setBusPath] = useState(undefined);

  const [currentBusStops, setCurrentBusStops] = useState(undefined);
  const [nextCurrentBusStop, setNextCurrentBusStop] = useState(undefined);
  const [currentBusDelay, setCurrentBusDelay] = useState(undefined);

  const [currentTramStops, setCurrentTramStops] = useState(undefined);
  const [nextCurrentTramStop, setNextCurrentTramStop] = useState(undefined);
  const [currentTramDelay, setCurrentTramDelay] = useState(undefined);

  const [tramStopPassages, setTramStopPassages] = useState(undefined);

  const [delay, setDelay] = useState(undefined); // TODO

  /* TRAMS */

  function getCurrentTramStops() {
    fetch(`${API_HOST}/tram/tripInfo/tripPassages/${tripId}`)
      .then(response => response.json())
      .then(tramStops => {
        setCurrentTramStops(tramStops.actual);

        if (tramStops.length > 0) {
          setNextCurrentTramStop(currentTramStops[0].stop.shortName);
        }
      });
  }

  function getCurrentTramDelay() {
    console.log("get tram delay");
    const tramId = id;

    fetch(`${API_HOST}/tram/passageInfo/stops/${nextCurrentTramStop}`)
      .then(response => response.json())
      .then(passages => {
        const passage = passages.actual.filter(
          passage => passage.vehicleId === tramId
        )[0];

        if (passage != null) {
          const actualTime = LocalTime.parse(passage.actualTime);
          const plannedTime = LocalTime.parse(passage.plannedTime);

          const tramDelay = plannedTime.until(actualTime, ChronoUnit.MINUTES);
          setCurrentTramDelay(tramDelay);
        }
      });
  }

  function displayTramStop(stop) {
    let time = stop.actualTime;

    if (delay !== undefined && delay > 0) {
      time = <span className="delay-text">{time}</span>;
    }

    return (
      <li key={stop.stop_seq_num} className="current-tram-stop">
        <span className="stop-num">{stop.stop_seq_num}</span> {stop.stop.name} (
        {time})
      </li>
    );
  }

  function getTramWaypoints() {
    fetch(`${API_HOST}/tram/pathInfo/vehicle/${id}`)
      .then(response => response.json())
      .then(fetchedPath => {
        fetchedPath = fetchedPath.paths[0];
        fetchedPath.wayPoints = fetchedPath.wayPoints.map(wayPoint =>
          normalizeCoords(wayPoint)
        );
        setTramPath(fetchedPath);
      });
  }

  function displayTramPath() {
    if (tramPath === undefined) {
      return ""; // TODO
    }
    if (showTramPath) {
      return (
        <Polyline positions={tramPath.wayPoints} color={"#4286f4"} weight={5} />
      );
    }
    return ""; // TODO
  }

  /* END OF TRAMS */

  /* BUSES */

  function getCurrentBusStops() {
    fetch(`${API_HOST}/bus/tripInfo/tripPassages/${tripId}`)
      .then(response => response.json())
      .then(obj => {
        setCurrentBusStops(obj.actual);

        if (currentBusStops.length > 0) {
          setNextCurrentBusStop(currentBusStops[0].stop.shortName);
        }
      });
  }

  function getCurrentBusDelay() {
    console.log("getting bus delay");

    const busId = id;

    fetch(`${API_HOST}/bus/passageInfo/stops/${nextCurrentBusStop}`)
      .then(response => response.json())
      .then(passages => {
        const passage = passages.actual.filter(
          passage => passage.vehicleId === busId
        )[0];

        if (passage != null) {
          const actualTime = LocalTime.parse(passage.actualTime);
          const plannedTime = LocalTime.parse(passage.plannedTime);

          const busDelay = plannedTime.until(actualTime, ChronoUnit.MINUTES);
          setCurrentBusDelay(busDelay);
        }
      });
  }

  function getBusWaypoints() {
    fetch(`${API_HOST}/bus/pathInfo/vehicle/${id}`)
      .then(response => response.json())
      .then(fetchedPath => {
        fetchedPath = fetchedPath.paths[0];
        fetchedPath.wayPoints = fetchedPath.wayPoints.map(wayPoint =>
          normalizeCoords(wayPoint)
        );
        setBusPath(fetchedPath);
      });
  }

  function displayBusPath() {
    if (busPath === undefined) {
      return "";
    }
    if (showBusPath) {
      return (
        <Polyline positions={busPath.wayPoints} color={"#4286f4"} weight={5} />
      );
    }
    return "";
  }

  function getBusStopPassages() {
   /* fetch(`${API_HOST}/bus/passageInfo/stops/${shortName}`) // TODO
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
      });*/
  }

  function displayPassage(passage) {
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

  function displayBusStop(stop) {
    let time = stop.actualTime;

    if (delay !== undefined && delay > 0) {
      // TODO
      time = <span className="delay-text">{time}</span>;
    }

    return (
      <li key={stop.stop_seq_num} className="current-bus-stop">
        <span className="stop-num">{stop.stop_seq_num}</span> {stop.stop.name} (
        {time})
      </li>
    );
  }

  function initDataFetchingForBus() {
    clearFetchInterval();
    setShowBusPath(true);
    // getWaypoints();
    getCurrentBusStops();
    if (nextCurrentBusStop !== undefined) {
      getCurrentBusDelay();
    }
    const busIntervalId = setInterval(() => {
      console.log("fetching data for bus");
      getCurrentBusStops();
      if (nextCurrentBusStop !== undefined) {
        getCurrentBusDelay();
      }
    }, 7000);

    setIntervalId(busIntervalId);
  }

  function initDataFetchingForTram() {
    clearFetchInterval();
    setShowTramPath(true);
    // getWaypoints();
    getCurrentTramStops();
    if (nextCurrentTramStop !== undefined) {
      getCurrentTramDelay();
    }
    const tramIntervalId = setInterval(() => {
      console.log("fetching data for tram");
      getCurrentTramStops();
      if (nextCurrentTramStop !== undefined) {
        getCurrentTramDelay();
      }
    }, 7000);

    setIntervalId(tramIntervalId);
  }

  useEffect(() => {
    switch (type) {
      case "tram": {
        initDataFetchingForTram();
        break;
      }
      case "bus":
        {
          initDataFetchingForBus();
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
    return () => {
      clearFetchInterval();
    };
    // eslint-disable-next-line
  }, []);

  function getTramStopPassages() {
    /* fetch(`${API_HOST}/tram/passageInfo/stops/${this.props.info.shortName}`)
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
         this.setState({ passages });
       });*/
  }

  function displayTramStopPassage(passage) {
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

  function clearFetchInterval() {
    if (intervalId !== null) {
      clearInterval(); // TODO
    }
  }

  useEffect(() => {
    if (intervalId === null) {
      switch (type) {
        case "bus":
          initDataFetchingForBus();
          break;
        case "tram":
          initDataFetchingForTram();
          break;
        default:
          break;
      }
    }
  }, [type]);

  switch (type) {
    case "tram": {
      let tramDelay = "obliczam...";

      if (currentTramDelay !== undefined) {
        tramDelay = currentTramDelay;

        if (tramDelay > 0) {
          tramDelay = <span className="delay-text">{tramDelay} min</span>;
        } else {
          tramDelay = <span className="nodelay-text">brak</span>;
        }
      }

      if (currentTramStops === undefined) {
        return "loading tram";
      }

      return (
        <>
          <div className="marker-details">
            <button className="close-details" onClick={onClose}>
              X
            </button>
            <h2 className="tram-name">{name}</h2>
            <span className="sub-title">
              Opóźnienie: {delay}
              <br />
            </span>
            <span className="sub-title">
              <br />
            </span>
            <span className="sub-title">Kolejne przystanki:</span>
            <ul className="stops-list">
              {currentTramStops.map(stop => displayTramStop(stop))}
            </ul>
          </div>
          {displayTramPath()}
        </>
      );
    }
    case "bus": {
      if (currentBusStops === undefined) {
        return "loading bus";
      }

      let busDelay = "obliczam...";

      if (currentBusDelay !== undefined) {
        busDelay = currentBusDelay;

        busDelay =
          busDelay > 0 ? (
            <span className="delay-text">{busDelay} min</span>
          ) : (
            <span className="nodelay-text">brak</span>
          );
      }

      return (
        <div className="marker-details">
          <h2 className="bus-name">{name}</h2>
          <span className="sub-title">
            Opóźnienie: {busDelay}
            <br />
          </span>
          <span className="sub-title">
            <br />
          </span>
          <span className="sub-title">Kolejne przystanki:</span>
          <ul className="stops-list">
            {currentBusStops.map(stop => displayBusStop(stop))}
          </ul>
        </div>
      );
    }
    case "tram_stop":
      {
        return(
            <>
              <h2 className="stop-name">{name}</h2>
              <span className="sub-title">
            <br />
          </span>
              <span className="sub-title">Planowe odjazdy:</span>
              <ul className="passages-list">
                {tramStopPassages.map(passage => displayTramStopPassage(passage))}
              </ul>
              </>
        );
      }
    case "bus_stop":
      {
        return (
          <div className="marker-details">
            <h2 className="stop-name">{name}</h2>
            <span className="sub-title">
              <br />
            </span>
            <span className="sub-title">Planowe odjazdy:</span>
            <ul className="passages-list">
              {this.state.passages.map(passage => displayPassage(passage))}
            </ul>
          </div>
        );
      }
      break;

    default:
      console.log("type prop is incorrect");
      return null;
  }
}
