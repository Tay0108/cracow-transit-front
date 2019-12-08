import React from "react";
import "./map-options.css";

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
  return (
    <form className="map-options">
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
