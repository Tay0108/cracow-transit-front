import React from "react";
import "../../styles/marker-details.css";
import "./stop-details.css";
import { ChronoUnit, LocalTime } from "js-joda";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import DetailsLoader from "../DetailsLoader/DetailsLoader";
import useStopDetails from "../../hooks/useStopDetails";

export default function StopDetails({ stop, onClose }) {
  const stopDetails = useStopDetails(stop);

  function displayStopPassage(passage) {
    let actualTime = LocalTime.parse(passage.actualTime);
    let plannedTime = LocalTime.parse(passage.plannedTime);

    let delay = plannedTime.until(actualTime, ChronoUnit.MINUTES);

    return (
      <li key={passage.passageid}>
        <div className="passage-number">{passage.patternText}</div>w kierunku{" "}
        {passage.direction} o {passage.plannedTime}
        <span className="delay-text">{delay > 0 ? `(+${delay}min)` : ""}</span>
      </li>
    );
  }

  if (stop === null) {
    return null;
  }

  if (stopDetails.stopPassages === undefined) {
    return <DetailsLoader />;
  }

  return (
    <div className="marker-details">
      <header className="marker-details-header">
        <button className="close-details" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className="stop-name">{stop.name}</h2>
        <span className="sub-title">
          <br />
        </span>
      </header>
      <span className="sub-title">Planowe odjazdy:</span>
      <ul className="passages-list">
        {stopDetails.stopPassages.map(passage =>
          displayStopPassage(passage)
        )}
      </ul>
    </div>
  );
}
