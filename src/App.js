import React, { useState } from "react";
import "./App.css";
import MapContainer from "./components/MapContainer/MapContainer";
import MapOptions from "./components/MapOptions/MapOptions";
import AppLoader from "./components/AppLoader/AppLoader";
import VehicleDetails from "./components/VehicleDetails/VehicleDetails";
import StopDetails from "./components/StopDetails/StopDetails";
import useTramStops from "./hooks/useTramStops";
import useBusStops from "./hooks/useBusStops";
import useTrams from "./hooks/useTrams";
import useBuses from "./hooks/useBuses";

export default function App() {
  const trams = useTrams();
  const tramStops = useTramStops();
  const buses = useBuses();
  const busStops = useBusStops();

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

  const [vehiclePath, setVehiclePath] = useState(null);

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
    setMarkerOpen(true);
    setMarkerObjectType("tram");
    setOpenTram(tram);
  }

  function closeTramDetails() {
    setMarkerOpen(false);
    setMarkerObjectType(null);
    setOpenTram(null);
    setVehiclePath(null);
  }

  function openTramStopDetails(tramStop) {
    setMarkerOpen(true);
    setMarkerObjectType("tram_stop");
    setOpenTramStop(tramStop);
  }

  function closeTramStopDetails() {
    setMarkerOpen(false);
    setMarkerObjectType(null);
    setOpenTramStop(null);
  }

  function openBusDetails(bus) {
    setMarkerOpen(true);
    setMarkerObjectType("bus");
    setOpenBus(bus);
  }

  function closeBusDetails() {
    setMarkerOpen(false);
    setMarkerObjectType(null);
    setOpenBus(null);
  }

  function openBusStopDetails(busStop) {
    setMarkerOpen(true);
    setMarkerObjectType("bus_stop");
    setOpenBusStop(busStop);
  }

  function closeBusStopDetails() {
    setMarkerOpen(false);
    setMarkerObjectType(null);
    setOpenBusStop(null);
  }

  if (
    //tramStops === undefined || TODO
    //trams === undefined ||
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
              return <VehicleDetails onClose={closeTramDetails} vehicle={openTram} />;
            }
            case "tram_stop":
              if (openTramStop === null) {
                return;
              }
              return (
                <StopDetails
                  onClose={closeTramStopDetails}
                  stop={openTramStop}
                />
              );
            case "bus":
              if (openBus === null) {
                return;
              }
              return <VehicleDetails onClose={closeBusDetails} vehicle={openBus} />;
            case "bus_stop":
              if (openBusStop === null) {
                return;
              }
              return (
                <StopDetails
                  onClose={closeBusStopDetails}
                  stop={openBusStop}
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
        setVehiclePath={setVehiclePath}
        vehiclePath={vehiclePath}
      />
    </div>
  );
}
