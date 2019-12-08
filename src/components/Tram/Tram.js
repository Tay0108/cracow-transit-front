import React from "react";
import "./tram.css";
import { Marker } from "react-leaflet";
import L from "leaflet";
import API_HOST from "../../API_HOST";
import normalizeCoords from "../../util/normalizeCoords";

const tramIcon = new L.Icon({
  iconUrl: "/img/tram.svg",
  iconRetinaUrl: "/img/tram.svg",
  iconSize: [25, 25]
});

export default function Tram({ info, onMarkerOpen, setTramPath }) {

  async function getTramPath() {
    const response = await fetch(
      `${API_HOST}/tram/pathInfo/vehicle/${info.id}`
    );
    const fetchedPath = await response.json();
    const path = fetchedPath.paths[0];
    path.wayPoints = path.wayPoints.map(wayPoint => normalizeCoords(wayPoint));
    return path;
  }

  async function openMarker() {
    // TODO: add some arrow or change icon color
    onMarkerOpen(info);
    const tramPath = await getTramPath();
    setTramPath(tramPath);
  }

  function closeMarker() {
    // TODO: revert to previous icon
    setTramPath(null);
  }

  return (
    <>
      <Marker
        key={info.id}
        position={[info.latitude, info.longitude]}
        icon={tramIcon}
        onClick={openMarker}
      />
    </>
  );
}
