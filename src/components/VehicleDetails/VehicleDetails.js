import React from "react";
import "../../styles/marker-details.css";
import "./vehicle-details.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import DetailsLoader from "../DetailsLoader/DetailsLoader";
import useVehicleDetails from "../../hooks/useVehicleDetails";

export default function VehicleDetails({ vehicle, onClose }) {
  const vehicleDetails = useVehicleDetails(vehicle);

  function displayVehicleStop(stop) {
    let time = stop.actualTime;

    if (
      vehicleDetails.vehicleDelay !== undefined &&
      vehicleDetails.vehicleDelay > 0
    ) {
      time = <span className="delay-text">{time}</span>;
    }

    return (
      <li key={stop.stop_seq_num} className="vehicle-stop">
        <span className="stop-num">{stop.stop_seq_num}</span> {stop.stop.name} (
        {time})
      </li>
    );
  }

  if (vehicle === null) {
    return null;
  }

  let vehicleDelay = "obliczam...";

  if (vehicleDetails.vehicleDelay !== undefined) {
    vehicleDelay = vehicleDetails.vehicleDelay;

    if (vehicleDelay > 0) {
      vehicleDelay = <span className="delay-text">{vehicleDelay} min</span>;
    } else {
      vehicleDelay = <span className="nodelay-text">brak</span>;
    }
  }

  if (vehicleDetails.vehicleDelay === undefined) {
    return <DetailsLoader />;
  }

  return (
    <>
      <div className="marker-details">
        <header className="marker-details-header">
          <button className="close-details" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <h2 className="vehicle-name">{vehicle.name}</h2>
          <span className="sub-title">
            Opóźnienie: {vehicleDelay}
            <br />
          </span>
          <span className="sub-title">
            <br />
          </span>
        </header>
        <span className="sub-title">Kolejne przystanki:</span>
        <ul className="stops-list">
          {vehicleDetails.vehicleStops !== []
            ? vehicleDetails.vehicleStops.map(stop => displayVehicleStop(stop))
            : "Nie można teraz wyświetlić danych o tym pojeździe, spróbuj ponownie pozniej."}
        </ul>
      </div>
    </>
  );
}
