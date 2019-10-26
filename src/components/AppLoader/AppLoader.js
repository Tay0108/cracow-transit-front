import React from "react";
import { BarLoader } from "react-spinners";
import "./app-loader.css";

export default function AppLoader() {
  return (
    <div className="loader-wrapper">
      <div className="loader-box">
        <img src="img/tram.svg" alt="App logo" className="app-logo" />
        <div>
          <h1 className="app-title">Cracow Transit</h1>
          <BarLoader widthUnit={"%"} width={100} />
        </div>
      </div>
    </div>
  );
}
