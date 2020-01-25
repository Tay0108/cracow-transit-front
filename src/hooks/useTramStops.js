import React, { useState, useEffect } from "react";
import API_HOST from "../API_HOST";
import normalizeMarker from "../util/normalizeMarker";

export default function useTramStops() {
  const [tramStops, setTramStops] = useState(undefined);

  useEffect(() => {
    getTramStops();
  }, []);

  function getTramStops() {
    fetch(`${API_HOST}/tram/stopInfo/stops`)
      .then(response => response.json())
      .then(tramStopsFetched => {
        if (tramStopsFetched.status === 500) {
          console.log("Tram stops responded with 500");
          return;
        }

        tramStopsFetched = tramStopsFetched.stops.filter(
          stop => stop.category === "tram"
        );
        tramStopsFetched = tramStopsFetched.map(stop => normalizeMarker(stop));
        setTramStops(tramStopsFetched);
      });
  }

  return tramStops;
}
