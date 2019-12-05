import React, { useState, useEffect } from "react";
import "../../styles/marker-details.css";
import "./tram-details.css";
import API_HOST from "../../API_HOST";
import { ChronoUnit, LocalTime } from "js-joda";
import normalizeCoords from "../../util/normalizeCoords";
import { Polyline } from "react-leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import DetailsLoader from "../DetailsLoader/DetailsLoader";

// TODO: napisac hooka ktory jednorazowo fetchuje dane dla autobusu lub tramwaju a tu zrobic metode refresh ktora go uzywa

export default function TramDetails({ tram, onClose }) {
  const [showTramPath, setShowTramPath] = useState(false); // TODO
  const [tramPath, setTramPath] = useState(undefined);

  const [currentTramStops, setCurrentTramStops] = useState(undefined);
  const [currentTramDelay, setCurrentTramDelay] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      setShowTramPath(true);
      // getTramWaypoints();
      let fetchedTramStops = await getCurrentTramStops();

      setCurrentTramStops(fetchedTramStops);

      let fetchedTramNextStop;

      if (fetchedTramStops && fetchedTramStops.length > 0) {
        fetchedTramNextStop = fetchedTramStops[0].stop.shortName;
        console.log("fetchedTramNextStop:", fetchedTramStops[0].stop.shortName);
      }

      if (fetchedTramNextStop !== undefined) {
        const fetchedTramDelay = await getCurrentTramDelay(fetchedTramNextStop);
        console.log("fetchedTramDelay:", fetchedTramDelay);
        setCurrentTramDelay(fetchedTramDelay);
      }
    }

    fetchData();

    const tramIntervalId = setInterval(() => {
      fetchData();
    }, 7000);

    return () => {
      clearInterval(tramIntervalId);
    };
    // eslint-disable-next-line
  }, [tram.id]);

  async function getCurrentTramStops() {
    console.log("getCurrentTramStops(): start");
    try {
      let response = await fetch(
        `${API_HOST}/tram/tripInfo/tripPassages/${tram.tripId}`
      );
      response = await response.json();
      const tramStops = response.actual;
      return tramStops;
    } catch (error) {
      console.error(error);
      console.error("getCurrentTramStops(): return []");
      return [];
    }
  }

  async function getCurrentTramDelay(nextStop) {
    console.log("get tram delay");

    try {
      const response = await fetch(
        `${API_HOST}/tram/passageInfo/stops/${nextStop}`
      );
      const passages = await response.json();

      if (passages.status === 500) {
        console.error("Fetching passages for tram returned 500");
        return null;
      }
      const passage = passages.actual.filter(
        currentPassage => currentPassage.vehicleId === tram.id
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

  function displayTramStop(stop) {
    let time = stop.actualTime;

    if (currentTramDelay !== undefined && currentTramDelay > 0) {
      time = <span className="delay-text">{time}</span>;
    }

    return (
      <li key={stop.stop_seq_num} className="current-tram-stop">
        <span className="stop-num">{stop.stop_seq_num}</span> {stop.stop.name} (
        {time})
      </li>
    );
  }

  async function getTramWaypoints() {
    fetch(`${API_HOST}/tram/pathInfo/vehicle/${tram.id}`)
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

  if (tram === null) {
    return null;
  }

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
    return <DetailsLoader />;
  }

  return (
    <>
      <div className="marker-details">
        <header className="marker-details-header">
          <button className="close-details" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <h2 className="vehicle-name">{tram.name}</h2>
          <span className="sub-title">
            Opóźnienie: {tramDelay}
            <br />
          </span>
          <span className="sub-title">
            <br />
          </span>
        </header>
        <span className="sub-title">Kolejne przystanki:</span>
        <ul className="stops-list">
          {currentTramStops.map(stop => displayTramStop(stop))}
        </ul>
      </div>
      {displayTramPath()}
    </>
  );
}
