import React from "react";
import "./bus-stop.css";
import { Marker } from "react-leaflet";
import L from "leaflet";

const busStopIcon = new L.Icon({
  iconUrl: "/img/bus-stop.svg",
  iconRetinaUrl: "/img/bus-stop.svg",
  iconSize: [20, 20]
});

export default function BusStop({ info, onMarkerOpen }) {
  function openMarker() {
    // TODO: add some arrow or change icon color
    onMarkerOpen("bus_stop", info.busId, info.tripId, info.name);
  }

  return (
    <Marker
      position={[info.latitude, info.longitude]}
      icon={busStopIcon}
      onClick={openMarker}
    />
  );
}
