import React, { useState } from "react";
import "./tram.scss";
import { Marker } from "react-leaflet";
import L from "leaflet";
import API_HOST from "../../API_HOST";
import normalizeCoords from "../../util/normalizeCoords";
import ActiveTramSvg from "./active-tram.svg";
import TramSvg from "./tram.svg";

function createTramIcon(tramNumber, isActive) {
  if (isActive) {
    return new L.divIcon({
      className: "tram-wrapper",
      html: `<div class="tram">
      <div class="tram-number">${tramNumber}</div>
      <img class="tram-icon" src=${ActiveTramSvg} alt="tram" />
    </div>`
    });
  }

  return new L.divIcon({
    className: "tram-wrapper",
    html: `<div class="tram">
      <div class="tram-number">${tramNumber}</div>
      <img class="tram-icon" src=${TramSvg} alt="tram" />
    </div>`
  });
}

export default function Tram({ info, onMarkerOpen, setTramPath }) {
  const [isActive, setActive] = useState(false);

  const tramNumber = info.name.split(" ")[0];

  const tramIcon = createTramIcon(tramNumber, isActive);

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
    setActive(true);
    onMarkerOpen(info);
    const tramPath = await getTramPath();
    setTramPath(tramPath);
  }

  function closeMarker() {
    // TODO: revert to previous icon
    setActive(false);
    setTramPath(null);
  }

  return (
    <Marker
      key={info.id}
      position={[info.latitude, info.longitude]}
      icon={tramIcon}
      onClick={openMarker}
    />
  );
}
