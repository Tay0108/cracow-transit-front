import React from "react";
import "./map-options-button.css";
import {faCogs} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function MapOptionsButton({onClick}) {
    return(
        <button className="map-options-button" onClick={onClick}>
            <FontAwesomeIcon icon={faCogs} className="cogwheel"/>
        </button>
    );
}
