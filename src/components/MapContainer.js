import React, { Component } from 'react';
import { Map, TileLayer } from 'react-leaflet';
// import RotatedMarker from './RotatedMarker';
import './mapcontainer.css';
import Stop from './Stop';
import Tram from './Tram';

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
            <Stop key={stop.id} info={stop}/>
        );
    }

    displayTram(tram) {
        return (
            <Tram key={tram.id} info={tram}/>
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
