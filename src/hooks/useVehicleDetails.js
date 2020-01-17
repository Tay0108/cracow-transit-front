import {useState, useEffect} from "react";
import API_HOST from "../API_HOST";
import {ChronoUnit, LocalTime} from "js-joda";

export default function useVehicleDetails(vehicle) {
    const [vehicleStops, setVehicleStops] = useState([]);
    const [vehicleDelay, setVehicleDelay] = useState(undefined);

    useEffect(() => {
        async function fetchData() {
            let fetchedVehicleStops = await getVehicleStops();
            setVehicleStops(fetchedVehicleStops);

            let fetchedVehicleNextStop;

            if (fetchedVehicleStops && fetchedVehicleStops.length > 0) {
                fetchedVehicleNextStop = fetchedVehicleStops[0].stop.shortName;
            }

            if (fetchedVehicleNextStop !== undefined) {
                const fetchedVehicleDelay = await getVehicleDelay(fetchedVehicleNextStop);
                setVehicleDelay(fetchedVehicleDelay);
            }
        }

        fetchData();

        const vehicleIntervalId = setInterval(() => {
            fetchData();
        }, 7000);

        return () => {
            clearInterval(vehicleIntervalId);
        };
    }, [vehicle.id]);

    async function getVehicleStops() {
        try {
            let url;

            if(vehicle.category === "tram") {
                url = `${API_HOST}/tram/tripInfo/tripPassages/${vehicle.tripId}`
            } else if(vehicle.category === "bus") {
                url = `${API_HOST}/bus/tripInfo/tripPassages/${vehicle.tripId}`;
            }

            let response = await fetch(url);
            response = await response.json();
            const vehicleStops = response.actual;
            return vehicleStops;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async function getVehicleDelay(nextStop) {
        try {
            let url;

            if(vehicle.category === "tram") {
                url = `${API_HOST}/tram/passageInfo/stops/${nextStop}`
            } else if(vehicle.category === "bus") {
                url = `${API_HOST}/bus/passageInfo/stops/${nextStop}`
            }

            const response = await fetch(url);
            const passages = await response.json();

            if (passages.status === 500) {
                console.error("Fetching passages for vehicle returned 500");
                return null;
            }
            const passage = passages.actual.filter(
                currentPassage => currentPassage.vehicleId === vehicle.id
            )[0];
            if (passage != null) {
                const actualTime = LocalTime.parse(passage.actualTime);
                const plannedTime = LocalTime.parse(passage.plannedTime);

                const timeDifference = plannedTime.until(
                    actualTime,
                    ChronoUnit.MINUTES
                );

                return timeDifference;
            }
        } catch (error) {
            console.error(error);
            return 0;
        }
    }

    return {
        vehicleStops,
        vehicleDelay
    };
}
