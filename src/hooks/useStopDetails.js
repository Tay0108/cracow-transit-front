import {useEffect, useState} from "react";
import API_HOST from "../API_HOST";

export default function useStopDetails(stop) {
    const [stopPassages, setStopPassages] = useState(undefined);

    useEffect(() => {
    if (stop === null) {
      return;
    }
    getStopPassages();

    const stopIntervalId = setInterval(() => {
      getStopPassages();
    }, 5000);

    return () => {
      clearInterval(stopIntervalId);
    };
    // eslint-disable-next-line
  }, [stop.shortName]);

  function getStopPassages() {
      let url;

      if(stop.category === "tram") {
          url = `${API_HOST}/tram/passageInfo/stops/${stop.shortName}`;
      } else if(stop.category === "bus") {
          url = `${API_HOST}/bus/passageInfo/stops/${stop.shortName}`
      }

    fetch(url)
      .then(response => response.json())
      .then(fetchedPassages => {
        if (fetchedPassages.status === 500) {
          console.error("Fetching passages for stop returned 500");
          return;
        }
        fetchedPassages = fetchedPassages.actual;
        fetchedPassages = fetchedPassages.filter(
          passage =>
            (passage.status =
              "PREDICTED" &&
              passage.actualTime !== null &&
              passage.actualTime !== undefined &&
              passage.plannedTime !== null &&
              passage.plannedTime !== undefined)
        );
        setStopPassages(fetchedPassages);
      });
  }

  return {
      stopPassages
  }
}
