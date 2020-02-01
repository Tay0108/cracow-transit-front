import React from "react";
import {Map, Marker, Polyline, TileLayer} from "react-leaflet";
import "./map-container.css";
import TramStop from "../TramStop/TramStop";
import Tram from "../Tram/Tram";
import Bus from "../Bus/Bus";
import BusStop from "../BusStop/BusStop";
import MarkerClusterGroup from "react-leaflet-markercluster";
import useGeolocation from "../../hooks/useGeolocation";
import L from "leaflet";

const youIcon = new L.Icon({
  iconUrl: "/img/you.svg",
  iconRetinaUrl: "/img/you.svg",
  iconSize: [45, 45]
});

export default function MapContainer({
  buses,
  busStops,
  trams,
  tramStops,
  clustering,
  onTramOpen,
  onTramStopOpen,
  onBusOpen,
  onBusStopOpen,
  vehiclePath,
  setVehiclePath
}) {
  const initialPosition = [50.0613888889, 19.9383333333];
  const initialZoom = 13;
  const userPosition = useGeolocation();

  function displayTramStop(tramStop) {
    return (
      <TramStop
        key={tramStop.id}
        info={tramStop}
        onMarkerOpen={onTramStopOpen}
      />
    );
  }

  function displayTram(tram) {
    return (
      <Tram
        key={tram.id}
        info={tram}
        onMarkerOpen={onTramOpen}
        setTramPath={setVehiclePath}
      />
    );
  }

  function displayBusStop(busStop) {
    return (
      <BusStop key={busStop.id} info={busStop} onMarkerOpen={onBusStopOpen} />
    );
  }

  function displayBus(bus) {
    return (
      <Bus
        key={bus.id}
        info={bus}
        onMarkerOpen={onBusOpen}
        onShowPath={setVehiclePath}
      />
    );
  }

  function displayVehiclePath() {
    if (vehiclePath === undefined || vehiclePath === null) {
      return ""; // TODO
    }
    return (
      <Polyline
        positions={vehiclePath.wayPoints}
        color={"#4286f4"}
        weight={5}
      />
    );
  }

  if (
    tramStops === undefined ||
    busStops === undefined ||
    trams === undefined ||
    buses === undefined
  ) {
    return null;
  }

  return (
    <Map center={initialPosition} zoom={initialZoom} maxZoom={18}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {clustering ? (
        <>
          <MarkerClusterGroup
            showCoverageOnHover={false}
            disableClusteringAtZoom={15}
            spiderfyOnMaxZoom={false}
          >
            {tramStops.map(stop => displayTramStop(stop))}
            {trams.map(tram => displayTram(tram))}
            {busStops.map(stop => displayBusStop(stop))}
            {buses.map(bus => displayBus(bus))}
          </MarkerClusterGroup>
        </>
      ) : (
        <>
          {tramStops.map(stop => displayTramStop(stop))}
          {trams.map(tram => displayTram(tram))}
          {busStops.map(stop => displayBusStop(stop))}
          {buses.map(bus => displayBus(bus))}
        </>
      )}
      {userPosition.error ? "" : <Marker
          key={userPosition}
          position={[userPosition.latitude, userPosition.longitude]}
          icon={youIcon}
      />}
      {displayVehiclePath()}
    </Map>
  );
}
