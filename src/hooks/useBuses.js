import React, { useState, useEffect } from "react";
import API_HOST from "../API_HOST";
import { VEHICLE_REFRESH_TIME } from "../config";
import normalizeMarker from "../util/normalizeMarker";

export default function useBuses() {
    const [buses, setBuses] = useState(undefined);

    useEffect(() => {
        getBuses();
        setInterval(() => {
            getBuses();
        }, VEHICLE_REFRESH_TIME);
        // eslint-disable-next-line
    }, []);

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
                        bus !== null &&
                        !bus.deleted &&
                        bus.latitude !== undefined &&
                        bus.longitude !== undefined
                );
                busesFetched = busesFetched.map(tram => normalizeMarker(tram));
                setBuses(busesFetched);
            });
    }

    return buses;
}
