import React, { useState, useEffect } from "react";
import "../../styles/marker-details.css";
import "./bus-details.css";
import API_HOST from "../../API_HOST";
import { ChronoUnit, LocalTime } from "js-joda";
import normalizeCoords from "../../util/normalizeCoords";
import { Polyline } from "react-leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import DetailsLoader from "../DetailsLoader/DetailsLoader";

export default function BusDetails({ bus, onClose }) {
  const [currentBusStops, setCurrentBusStops] = useState(undefined);
  const [nextCurrentBusStop, setNextCurrentBusStop] = useState(undefined);
  const [currentBusDelay, setCurrentBusDelay] = useState(undefined);

  const [showBusPath, setShowBusPath] = useState(false); // TODO
  const [busPath, setBusPath] = useState(undefined);

  function getCurrentBusStops() {
    fetch(`${API_HOST}/bus/tripInfo/tripPassages/${bus.tripId}`)
      .then(response => response.json())
      .then(busStops => {
        setCurrentBusStops(busStops.actual);

        if (busStops.length > 0) {
          setNextCurrentBusStop(busStops[0].stop.shortName);
        }
      });
  }
  function getBusWaypoints() {
    fetch(`${API_HOST}/bus/pathInfo/vehicle/${bus.id}`)
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

  function getCurrentBusDelay() {
    console.log("getting bus delay");

    fetch(`${API_HOST}/bus/passageInfo/stops/${nextCurrentBusStop}`)
      .then(response => response.json())
      .then(passages => {
        if (passages.status === 500) {
          console.error("Fetching passages for bus returned 500");
          return;
        }
        const passage = passages.actual.filter(
          passage => passage.vehicleId === bus.id
        )[0];

        if (passage != null) {
          const actualTime = LocalTime.parse(passage.actualTime);
          const plannedTime = LocalTime.parse(passage.plannedTime);

          const busDelay = plannedTime.until(actualTime, ChronoUnit.MINUTES);
          setCurrentBusDelay(busDelay);
        }
      });
  }

  function displayBusStop(stop) {
    let time = stop.actualTime;

    if (currentBusDelay !== undefined && currentBusDelay > 0) {
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

  useEffect(() => {
    setShowBusPath(true);
    // getBusWaypoints();
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

    return () => {
      clearInterval(busIntervalId);
    };
    // eslint-disable-next-line
  }, [bus.id]);

  if (bus === null) {
    return null;
  }

  if (currentBusStops === undefined) {
    return <DetailsLoader/>;
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
      <header className="marker-details-header">
        <button className="close-details" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className="vehicle-name">{bus.name}</h2>
        <span className="sub-title">
          Opóźnienie: {busDelay}
          <br />
        </span>
        <span className="sub-title">
          <br />
        </span>
      </header>
      <span className="sub-title">Kolejne przystanki:</span>
      <ul className="stops-list">
        {currentBusStops.map(stop => displayBusStop(stop))}
      </ul>
    </div>
  );
}
