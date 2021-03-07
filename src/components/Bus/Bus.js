import React, { useState } from "react";
import "./bus.scss";
import { Marker } from "react-leaflet";
import L from "leaflet";
import ActiveBusSvg from "./active-bus.svg";
import BusSvg from "./bus.svg";

function createBusIcon(busNumber, isActive) {
  if (isActive) {
    return new L.divIcon({
      className: "bus-wrapper",
      html: `<div class="bus">
      <div class="bus-number">${busNumber}</div>
      <img class="bus-icon" src=${ActiveBusSvg} alt="bus" />
    </div>`
    });
  }

  return new L.divIcon({
    className: "bus-wrapper",
    html: `<div class="bus">
      <div class="bus-number">${busNumber}</div>
      <img class="bus-icon" src=${BusSvg} alt="bus" />
    </div>`
  });
}

export default function Bus({ info, onMarkerOpen }) {
  const [isActive, setActive] = useState(false);

  const busNumber = info.name.split(" ")[0];

  const busIcon = createBusIcon(busNumber, isActive);


  // TODO: displaying path, like with trams:
  /*
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
   */


  function openMarker() {
    // TODO: add some arrow or change icon color
    setActive(true);
    onMarkerOpen(info);
  }

  function closeMarker() {
    setActive(false);
    // TODO: revert to previous icon
  }

  return (
    <Marker
      key={info.busId}
      position={[info.latitude, info.longitude]}
      icon={busIcon}
      onClick={openMarker}
    />
  );
}
