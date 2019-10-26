import React, { useEffect, useState } from "react";
import "./App.css";
import MapContainer from "./components/MapContainer/MapContainer";
import API_HOST from "./API_HOST";
import MarkerDetails from "./components/MarkerDetails/MarkerDetails";
import MapOptions from "./components/MapOptions/MapOptions";
import AppLoader from "./components/AppLoader/AppLoader";

export default function App() {
  const [trams, setTrams] = useState(undefined);
  const [tramStops, setTramStops] = useState(undefined);
  const [buses, setBuses] = useState(undefined);
  const [busStops, setBusStops] = useState(undefined);

  const [displayBuses, setDisplayBuses] = useState(false);
  const [displayBusStops, setDisplayBusStops] = useState(false);
  const [displayTrams, setDisplayTrams] = useState(true);
  const [displayTramStops, setDisplayTramStops] = useState(false);
  const [clustering, setClustering] = useState(true);
  const [markerOpen, setMarkerOpen] = useState(false);
  const [markerObjectType, setMarkerObjectType] = useState(null);
  const [markerObjectId, setMarkerObjectId] = useState(null);
  const [markerObjectName, setMarkerObjectName] = useState("");
  const [markerTripId, setMarkerTripId] = useState(null);

  useEffect(() => {
    getTramStops();
    getBusStops();
    getTrams();
    getBuses();
    setInterval(() => {
      getTrams();
      getBuses();
    }, 7000);
    // eslint-disable-next-line
  }, []);

  function normalizeMarker(obj) {
    if (obj.latitude !== undefined && obj.longitude !== undefined) {
      obj.latitude /= 1000.0 * 3600.0;
      obj.longitude /= 1000.0 * 3600.0;
    }
    return obj;
  }

  function getTramStops() {
    fetch(`${API_HOST}/tram/stopInfo/stops`)
      .then(response => response.json())
      .then(tramStopsFetched => {
        tramStopsFetched = tramStopsFetched.stops.filter(stop => stop.category === "tram");
        tramStopsFetched = tramStopsFetched.map(stop => normalizeMarker(stop));
        setTramStops(tramStopsFetched);
      });
  }

  function getTrams() {
    fetch(`${API_HOST}/tram/vehicleInfo/vehicles`)
      .then(response => response.json())
      .then(tramsFetched => {
        if (tramsFetched.status === 500) {
          console.error("Trams responded with 500");
          return;
        }
        tramsFetched = tramsFetched.vehicles.filter(
          tram =>
            !tram.deleted &&
            tram.latitude !== undefined &&
            tram.longitude !== undefined
        );
        tramsFetched = tramsFetched.map(tram => normalizeMarker(tram));
        setTrams(tramsFetched);
      });
  }

  function getBusStops() {
    fetch(`${API_HOST}/bus/stopInfo/stops`)
      .then(response => response.json())
      .then(busStopsFetched => {
        busStopsFetched = busStopsFetched.stops.filter(stop => stop.category === "bus");
        busStopsFetched = busStopsFetched.map(stop => normalizeMarker(stop));
        setBusStops(busStopsFetched);
      });
  }

  function getBuses() {
    fetch(`${API_HOST}/bus/vehicleInfo/vehicles`)
      .then(response => response.json())
      .then(busesFetched => {
        if (busesFetched.status === 500) {
          console.error("Buses responded with 500");
          return;
        }
        busesFetched = busesFetched.vehicles.filter(
          bus =>
            !bus.deleted &&
            bus.latitude !== undefined &&
            bus.longitude !== undefined
        );
        busesFetched = busesFetched.map(tram => normalizeMarker(tram));
        setBuses(busesFetched);
      });
  }

  function toggleDisplayBusStops(event) {
    setDisplayBusStops(event.target.checked);
  }

  function toggleDisplayBuses(event) {
    setDisplayBuses(event.target.checked);
  }

  function toggleDisplayTramStops(event) {
      setDisplayTramStops(event.target.checked);
  }

  function toggleDisplayTrams(event) {
    setDisplayTrams(event.target.checked);
  }

  function toggleClustering(event) {
    setClustering(event.target.checked);
  }

  function openMarkerDetails(type, id, tripId, name) {
    console.log("opening marker details");
    setMarkerOpen(true);
    setMarkerObjectType(type);
    setMarkerObjectId(id);
    setMarkerTripId(tripId);
    setMarkerObjectName(name);
  }

  function closeMarkerDetails() {
    console.log("closing marker details");
    setMarkerOpen(false);
    setMarkerObjectType(null);
    setMarkerObjectId(null);
    setMarkerTripId(null);
    setMarkerObjectName(null);
  }

  if (
    tramStops === undefined ||
    trams === undefined ||
    busStops === undefined ||
    buses === undefined
  ) {
    return <AppLoader />;
  }

  return (
    <div className="App">
      <MapOptions
        displayBusStops={displayBusStops}
        toggleDisplayBusStops={toggleDisplayBusStops}
        displayBuses={displayBuses}
        toggleDisplayBuses={toggleDisplayBuses}
        displayTrams={displayTrams}
        toggleDisplayTrams={toggleDisplayTrams}
        displayTramStops={displayTramStops}
        toggleDisplayTramStops={toggleDisplayTramStops}
        clustering={clustering}
        toggleClustering={toggleClustering}
      />
      {markerOpen ? (
        <MarkerDetails
          onClose={closeMarkerDetails}
          type={markerObjectType}
          id={markerObjectId}
          tripId={markerTripId}
          name={markerObjectName}
        />
      ) : (
        ""
      )}
      <MapContainer
        tramStops={displayTramStops ? tramStops : []}
        trams={displayTrams ? trams : []}
        busStops={displayBusStops ? busStops : []}
        buses={displayBuses ? buses : []}
        clustering={clustering}
        onMarkerOpen={openMarkerDetails}
        onMarkerClose={closeMarkerDetails}
      />
    </div>
  );
}
