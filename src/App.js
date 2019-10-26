import React, { useEffect, useState } from "react";
import "./App.css";
import MapContainer from "./components/MapContainer/MapContainer";
import API_HOST from "./API_HOST";
import MapOptions from "./components/MapOptions/MapOptions";
import AppLoader from "./components/AppLoader/AppLoader";
import TramDetails from "./components/TramDetails/TramDetails";
import TramStopDetails from "./components/TramStopDetails/TramStopDetails";
import BusDetails from "./components/BusDetails/BusDetails";
import BusStopDetails from "./components/BusStopDetails/BusStopDetails";

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

  const [openBus, setOpenBus] = useState(null);
  const [openTram, setOpenTram] = useState(null);
  const [openBusStop, setOpenBusStop] = useState(null);
  const [openTramStop, setOpenTramStop] = useState(null);

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
        tramStopsFetched = tramStopsFetched.stops.filter(
          stop => stop.category === "tram"
        );
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
        busStopsFetched = busStopsFetched.stops.filter(
          stop => stop.category === "bus"
        );
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

  function openTramDetails(tram) {
    console.log("opening tram details");
    console.log(tram);
    setMarkerOpen(true);
    setMarkerObjectType("tram");
    setOpenTram(tram);
  }

  function closeTramDetails() {
    console.log("closing tram details");
    setMarkerOpen(false);
    setMarkerObjectType(null);
    setOpenTram(null);
  }

  function openTramStopDetails(tramStop) {
    console.log("opening tramStop details");
    console.log(tramStop);
    setMarkerOpen(true);
    setMarkerObjectType("tram_stop");
    setOpenTramStop(tramStop);
  }

  function closeTramStopDetails() {
    console.log("closing tramStop details");
    setMarkerOpen(false);
    setMarkerObjectType(null);
    setOpenTramStop(null);
  }

  function openBusDetails(bus) {
    console.log("opening bus details");
    console.log(bus);
    setMarkerOpen(true);
    setMarkerObjectType("bus");
    setOpenBus(bus);
  }

  function closeBusDetails() {
    console.log("closing bus details");
    setMarkerOpen(false);
    setMarkerObjectType(null);
    setOpenBus(null);
  }

  function openBusStopDetails(busStop) {
    console.log("opening busStop details");
    console.log(busStop);
    setMarkerOpen(true);
    setMarkerObjectType("bus_stop");
    setOpenBusStop(busStop);
  }

  function closeBusStopDetails() {
    console.log("closing busStop details");
    setMarkerOpen(false);
    setMarkerObjectType(null);
    setOpenBusStop(null);
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
      {(() => {
        if (markerOpen) {
          switch (markerObjectType) {
            case "tram": {
              if (openTram === null) {
                return;
              }
              return <TramDetails onClose={closeTramDetails} tram={openTram} />;
            }
            case "tram_stop":
              if (openTramStop === null) {
                return;
              }
              return (
                <TramStopDetails
                  onClose={closeTramStopDetails}
                  tramStop={openTramStop}
                />
              );
            case "bus":
              if (openBus === null) {
                return;
              }
              return <BusDetails onClose={closeBusDetails} bus={openBus} />;
            case "bus_stop":
              if (openBusStop === null) {
                return;
              }
              return (
                <BusStopDetails
                  onClose={closeBusStopDetails}
                  busStop={openBusStop}
                />
              );
            default:
              break;
          }
        }
      })()}
      <MapContainer
        tramStops={displayTramStops ? tramStops : []}
        trams={displayTrams ? trams : []}
        busStops={displayBusStops ? busStops : []}
        buses={displayBuses ? buses : []}
        clustering={clustering}
        onTramOpen={openTramDetails}
        onTramStopOpen={openTramStopDetails}
        onBusOpen={openBusDetails}
        onBusStopOpen={openBusStopDetails}
      />
    </div>
  );
}
