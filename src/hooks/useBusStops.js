import React, { useState, useEffect } from "react";
import API_HOST from "../API_HOST";
import normalizeMarker from "../util/normalizeMarker";

export default function useTramStops() {
    const [busStops, setBusStops] = useState(undefined);

    useEffect(() => {
        getBusStops();
    }, []);

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

    return busStops;
}
