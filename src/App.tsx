import React, { ChangeEvent, useState } from "react";
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
import { Bus, BusStop, Tram, TramStop } from "./types/types";

export default function App() {
  const trams = useTrams();
  const tramStops = useTramStops();
  const buses = useBuses();
  const busStops = useBusStops();

  const [displayBuses, setDisplayBuses] = useState<boolean>(true);
  const [displayBusStops, setDisplayBusStops] = useState<boolean>(false);
  const [displayTrams, setDisplayTrams] = useState<boolean>(true);
  const [displayTramStops, setDisplayTramStops] = useState<boolean>(false);
  const [clustering, setClustering] = useState<boolean>(false);

  const [markerOpen, setMarkerOpen] = useState<boolean>(false);
  const [markerObjectType, setMarkerObjectType] = useState<string | null>(null); // enum as well

  const [openBus, setOpenBus] = useState<Bus | null>(null);
  const [openTram, setOpenTram] = useState<Tram | null>(null);
  const [openBusStop, setOpenBusStop] = useState<BusStop | null>(null);
  const [openTramStop, setOpenTramStop] = useState<TramStop | null>(null);

  const [vehiclePath, setVehiclePath] = useState(null);

  function toggleDisplayBusStops(event: ChangeEvent<HTMLInputElement>) {
    setDisplayBusStops(event.target.checked);
  }

  function toggleDisplayBuses(event: ChangeEvent<HTMLInputElement>) {
    setDisplayBuses(event.target.checked);
  }

  function toggleDisplayTramStops(event: ChangeEvent<HTMLInputElement>) {
    setDisplayTramStops(event.target.checked);
  }

  function toggleDisplayTrams(event: ChangeEvent<HTMLInputElement>) {
    setDisplayTrams(event.target.checked);
  }

  function toggleClustering(event: ChangeEvent<HTMLInputElement>) {
    setClustering(event.target.checked);
  }

  function openTramDetails(tram: Tram) {
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

  function openTramStopDetails(tramStop: TramStop) {
    setMarkerOpen(true);
    setMarkerObjectType("tram_stop");
    setOpenTramStop(tramStop);
  }

  function closeTramStopDetails() {
    setMarkerOpen(false);
    setMarkerObjectType(null);
    setOpenTramStop(null);
  }

  function openBusDetails(bus: Bus) {
    setMarkerOpen(true);
    setMarkerObjectType("bus");
    setOpenBus(bus);
  }

  function closeBusDetails() {
    setMarkerOpen(false);
    setMarkerObjectType(null);
    setOpenBus(null);
  }

  function openBusStopDetails(busStop: BusStop) {
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
