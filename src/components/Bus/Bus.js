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
