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
  const [currentBusDelay, setCurrentBusDelay] = useState(undefined);
  const [showBusPath, setShowBusPath] = useState(false); // TODO
  const [busPath, setBusPath] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      setShowBusPath(true);
      // getTramWaypoints();
      let fetchedBusStops = await getCurrentBusStops();
      setCurrentBusStops(fetchedBusStops);

      let fetchedBusNextStop;

      if (fetchedBusStops && fetchedBusStops.length > 0) {
        fetchedBusNextStop = fetchedBusStops[0].stop.shortName;
      }

      if (fetchedBusNextStop !== undefined) {
        const fetchedBusDelay = await getCurrentBusDelay(fetchedBusNextStop);
        setCurrentBusDelay(fetchedBusDelay);
      }
    }

    fetchData();

    const busIntervalId = setInterval(() => {
      fetchData();
    }, 7000);

    return () => {
      clearInterval(busIntervalId);
    };
    // eslint-disable-next-line
  }, [bus.id]);

  async function getCurrentBusStops() {
    try {
      let response = await fetch(
        `${API_HOST}/bus/tripInfo/tripPassages/${bus.tripId}`
      );
      response = await response.json();
      const busStops = response.actual;
      setCurrentBusStops(busStops);
      return busStops;
    } catch (error) {
      console.error(error);
      console.error("getCurrentBusStops(): return []");
      return [];
    }
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

  async function getCurrentBusDelay(nextStop) {
    try {
      const response = await fetch(
        `${API_HOST}/bus/passageInfo/stops/${nextStop}`
      );
      const passages = await response.json();

      if (passages.status === 500) {
        console.error("Fetching passages for bus returned 500");
        return null;
      }
      const passage = passages.actual.filter(
        passage => passage.vehicleId === bus.id
      )[0];

      if (passage != null) {
        const actualTime = LocalTime.parse(passage.actualTime);
        const plannedTime = LocalTime.parse(passage.plannedTime);

        const timeDifference = plannedTime.until(
          actualTime,
          ChronoUnit.MINUTES
        );
        return timeDifference;
      }
    } catch (error) {
      console.error(error);
      return 0;
    }
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

  if (bus === null) {
    return null;
  }

  if (currentBusStops === undefined) {
    return <DetailsLoader />;
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
        {currentBusStops !== []
          ? currentBusStops.map(stop => displayBusStop(stop))
          : "Nie można teraz wyświetlić danych o tym autobusie, spróbuj ponownie pozniej."}
      </ul>
    </div>
  );
}
