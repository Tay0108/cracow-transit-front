import React, { useState, useEffect } from "react";
import API_HOST from "../API_HOST";
import normalizeMarker from "../util/normalizeMarker";

export default function useTrams() {
    const [trams, setTrams] = useState(undefined);

    useEffect(() => {
        getTrams();
        setInterval(() => {
            getTrams();
        }, 7000);
        // eslint-disable-next-line
    }, []);

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
                        tram !== null &&
                        !tram.deleted &&
                        tram.latitude !== undefined &&
                        tram.longitude !== undefined
                );
                tramsFetched = tramsFetched.map(tram => normalizeMarker(tram));
                setTrams(tramsFetched);
            });
    }

    return trams;
}
