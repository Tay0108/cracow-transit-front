import React, { useState } from "react";
import "./map-options.css";
import MapOptionsButton from "../MapOptionsButton/MapOptionsButton";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function MapOptions({
  displayBusStops,
  toggleDisplayBusStops,
  displayBuses,
  toggleDisplayBuses,
  displayTramStops,
  toggleDisplayTramStops,
  displayTrams,
  toggleDisplayTrams,
  clustering,
  toggleClustering
}) {
    const [isOpen, setIsOpen] = useState(true);

    if(!isOpen) {
        return <MapOptionsButton onClick={() => setIsOpen(true)}/>
    }

  return (
    <form className="map-options">
        <button className="close-options" onClick={() => setIsOpen(false)}>
            <FontAwesomeIcon icon={faTimes} />
        </button>
      <label className="option">
        Pokaż przystanki autobusowe:
        <input
          type="checkbox"
          checked={displayBusStops}
          onChange={toggleDisplayBusStops}
        />
      </label>
      <label className="option">
        Pokaż autobusy:
        <input
          type="checkbox"
          checked={displayBuses}
          onChange={toggleDisplayBuses}
        />
      </label>
      <label className="option">
        Pokaż przystanki tramwajowe:
        <input
          type="checkbox"
          checked={displayTramStops}
          onChange={toggleDisplayTramStops}
        />
      </label>
      <label className="option">
        Pokaż tramwaje:
        <input
          type="checkbox"
          checked={displayTrams}
          onChange={toggleDisplayTrams}
        />
      </label>
      <label className="option">
        Włącz klasteryzację:
        <input
          type="checkbox"
          checked={clustering}
          onChange={toggleClustering}
        />
      </label>
    </form>
  );
}
