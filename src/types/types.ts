export interface Tram { // todo: inherit from vehicle?
    category: string; // todo: change to enum?
    color: string;
    heading: number;
    id: string;
    latitude: number;
    longitude: number;
    name: string;
    path: Array<Object>;
    tripId: string;
}

export interface Bus {
    category: string;
    color: string;
    heading: number;
    id: string;
    latitude: number;
    longitude: number;
    name: string; 
    tripId: string;
}

export interface TramStop {
    category: string;
    id: string;
    latitude: number;
    longitude: number;
    name: string;
    shortName: string;
}

export interface BusStop {
    category: string;
    id: string;
    latitude: number;
    longitude: number;
    name: string;
    shortName: string;
}