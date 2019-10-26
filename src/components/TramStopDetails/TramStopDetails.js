import React, { useState, useEffect } from "react";
import "./tram-stop-details.css";
import API_HOST from "../../API_HOST";
import { ChronoUnit, LocalTime } from "js-joda";

export default function TramStopDetails({ tramStop, onClose }) {
  const [tramStopPassages, setTramStopPassages] = useState(undefined);

  function getTramStopPassages() {
    console.log("getTramStopPassages:", tramStop);
    fetch(`${API_HOST}/tram/passageInfo/stops/${tramStop.shortName}`)
      .then(response => response.json())
      .then(fetchedPassages => {
        if (fetchedPassages.status === 500) {
          console.error("Fetching passages for tram stop returned 500");
          return;
        }
        console.log("fetchedPassages:", fetchedPassages);
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
        setTramStopPassages(fetchedPassages);
      });
  }

  function displayTramStopPassage(passage) {
    let actualTime = LocalTime.parse(passage.actualTime);
    let plannedTime = LocalTime.parse(passage.plannedTime);

    let delay = plannedTime.until(actualTime, ChronoUnit.MINUTES);

    return (
      <li key={passage.passageid}>
        <div className="passage-number">{passage.patternText}</div>w kierunku
        {passage.direction} o {passage.plannedTime}
        <span className="delay-text">{delay > 0 ? `(+${delay}min)` : ""}</span>
      </li>
    );
  }

  useEffect(() => {
    if (tramStop === null) {
      return;
    }
    getTramStopPassages();

    const tramStopIntervalId = setInterval(() => {
      console.log("fetching data for tramStop");
      getTramStopPassages();
    }, 5000);

    return () => {
      clearInterval(tramStopIntervalId);
    };
      // eslint-disable-next-line
  }, [tramStop.shortName]);

    if (tramStop === null) {
    return null;
  }

  if (tramStopPassages === undefined) {
    return <>"loading tram stop passages"</>;
  }

  return (
    <div className="marker-details">
      <h2 className="stop-name">{tramStop.name}</h2>
      <span className="sub-title">
        <br />
      </span>
      <span className="sub-title">Planowe odjazdy:</span>
      <ul className="passages-list">
        {tramStopPassages.map(passage => displayTramStopPassage(passage))}
      </ul>
    </div>
  );
}
