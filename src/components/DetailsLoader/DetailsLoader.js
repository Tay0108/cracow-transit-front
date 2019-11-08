import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./details-loader.css";
import { ClipLoader } from "react-spinners";

export default function DetailsLoader({ onClose, name }) {
  return (
    <div className="marker-details">
      <header className="marker-details-header">
        <button className="close-details" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className="vehicle-name">{name}</h2>
      </header>
      <div className="loader">
        <ClipLoader color={"#ffffff"} />
      </div>
    </div>
  );
}
