import React, { useState, useEffect } from "react";
import "../../styles/marker-details.css";
import "./bus-stop-details.css";
import API_HOST from "../../API_HOST";
import { ChronoUnit, LocalTime } from "js-joda";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import DetailsLoader from "../DetailsLoader/DetailsLoader";

export default function BusStopDetails({ busStop, onClose }) {
  const [busStopPassages, setBusStopPassages] = useState(undefined);

  function getBusStopPassages() {
    fetch(`${API_HOST}/bus/passageInfo/stops/${busStop.shortName}`)
      .then(response => response.json())
      .then(fetchedPassages => {
        if (fetchedPassages.status === 500) {
          console.error("Fetching passages for bus stop returned 500");
          return;
        }
        fetchedPassages = fetchedPassages.actual;
        fetchedPassages = fetchedPassages.filter(
          passage =>
            (passage.status =
              "PREDICTED" &&
              passage.actualTime !== null &&
              passage.actualTime !== undefined &&
              passage.plannedTime !== null &&
              passage.plannedTime !== undefined)
        );
        setBusStopPassages(fetchedPassages);
      });
  }

  function displayBusStopPassage(passage) {
    const actualTime = LocalTime.parse(passage.actualTime);
    const plannedTime = LocalTime.parse(passage.plannedTime);

    let delay = plannedTime.until(actualTime, ChronoUnit.MINUTES);

    return (
      <li key={passage.passageid}>
        <div className="passage-number">{passage.patternText}</div> w kierunku
        {passage.direction} o {passage.plannedTime}
        <span className="delay-text">{delay > 0 ? `(+${delay}min)` : ""}</span>
      </li>
    );
  }

  useEffect(() => {
    getBusStopPassages();

    const busStopIntervalId = setInterval(() => {
      console.log("fetching data for busStop");
      getBusStopPassages();
    }, 5000);

    return () => {
      clearInterval(busStopIntervalId);
    };
    // eslint-disable-next-line
  }, [busStop.shortName]);

  if (busStop === null) {
    return null;
  }

  if (busStopPassages === undefined) {
      return <DetailsLoader/>;
  }

  return (
    <div className="marker-details">
      <header className="marker-details-header">
        <button className="close-details" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className="stop-name">{busStop.name}</h2>
        <span className="sub-title">
          <br />
        </span>
      </header>
      <span className="sub-title">Planowe odjazdy:</span>
      <ul className="passages-list">
        {busStopPassages.map(passage => displayBusStopPassage(passage))}
      </ul>
    </div>
  );
}
