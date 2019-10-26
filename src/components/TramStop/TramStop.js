import React from "react";
import "./tram-stop.css";
import { Marker } from "react-leaflet";
import L from "leaflet";

const tramStopIcon = new L.Icon({
  iconUrl: "/img/tram-stop.svg",
  iconRetinaUrl: "/img/tram-stop.svg",
  iconSize: [20, 20]
});

export default function TramStop({info, onMarkerOpen}) {
  function openMarker() {
    // TODO: add some arrow or change icon color
    onMarkerOpen("tram_stop", info.busId, info.tripId, info.name);
  }

    return (
      <Marker
        position={[info.latitude, info.longitude]}
        icon={tramStopIcon}
        onClick={openMarker}
      />
    );

}
