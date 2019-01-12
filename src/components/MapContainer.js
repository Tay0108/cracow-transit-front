import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './mapcontainer.css';

const tramIcon = new L.Icon({
    iconUrl: '/img/tram-r.svg',
    iconRetinaUrl: '/img/tram-r.svg',
    iconAnchor: [5, 55],
    popupAnchor: [10, -44],
    iconSize: [25, 55],
    shadowUrl: '/img/tram-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [20, 92],
});

const stopIcon = new L.Icon({
    iconUrl: '/img/stop.svg',
    iconRetinaUrl: '/img/stop.svg',
    iconAnchor: [5, 55],
    popupAnchor: [10, -44],
    iconSize: [25, 55],
    shadowUrl: '/img/tram-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [20, 92],
});

export default class MapContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lat: 50.0613888889,
            lng: 19.9383333333,
            zoom: 13
        };
    }

    displayStop(stop) {
        return (
            <Marker key={stop.id} position={[stop.latitude, stop.longitude]} icon={stopIcon}>
                <Popup>
                    Przystanek {stop.name}
                </Popup>
            </Marker>
        );
    }

    displayTram(tram) {

        if (tram.deleted === true) {
            return;
        }

        return (
            <Marker key={tram.id} position={[tram.latitude, tram.longitude]} icon={tramIcon}>
                <Popup>
                    Tramwaj nr {tram.name}
                </Popup>
            </Marker>
        );
    }

    render() {

        const position = [this.state.lat, this.state.lng];

        return (
            <Map center={position} zoom={this.state.zoom}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {this.props.stops.map((stop) => this.displayStop(stop))}
                {this.props.trams.map((tram) => this.displayTram(tram))}
            </Map>
        );
    }
}
