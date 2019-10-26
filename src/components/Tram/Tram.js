import React from "react";
import "./tram.css";
import { Marker } from "react-leaflet";
import L from "leaflet";

const tramIcon = new L.Icon({
  iconUrl: "/img/tram.svg",
  iconRetinaUrl: "/img/tram.svg",
  iconSize: [25, 25]
});

export default function Tram({ info, onMarkerOpen }) {
  function openMarker() {
    // TODO: add some arrow or change icon color
    onMarkerOpen("tram", info.tramId, info.tripId, info.name);
  }

  return (
    <>
      <Marker
        key={info.tramId}
        position={[info.latitude, info.longitude]}
        icon={tramIcon}
        onClick={openMarker}
      />
    </>
  );
}
