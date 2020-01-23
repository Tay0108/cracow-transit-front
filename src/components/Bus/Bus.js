import React from "react";
import "./bus.css";
import { Marker } from "react-leaflet";
import L from "leaflet";

const busIcon = new L.Icon({
  iconUrl: "/img/bus.svg",
  iconRetinaUrl: "/img/bus.svg",
  iconSize: [25, 25]
});

export default function Bus({ info, onMarkerOpen }) {

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
    onMarkerOpen(info);
  }

  function closeMarker() {
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
