import React, { Component } from 'react';
import { GoogleApiWrapper, Map, Marker, InfoWindow } from 'google-maps-react';

export class MapContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeMarker: {},
            selectedPlace: {},
            showingInfoWindow: false
        };
    }

    onMarkerClick = (props, marker) =>
        this.setState({
            activeMarker: marker,
            selectedPlace: props,
            showingInfoWindow: true
        });

    onInfoWindowClose = () =>
        this.setState({
            activeMarker: null,
            showingInfoWindow: false
        });

    onMapClicked = () => {
        if (this.state.showingInfoWindow)
            this.setState({
                activeMarker: null,
                showingInfoWindow: false
            });
    };

    displayStop(stop) {
        let stopIcon = new window.google.maps.MarkerImage(
            '/img/stop.svg',
            null, /* size is determined at runtime */
            null, /* origin is 0,0 */
            null, /* anchor is bottom center of the scaled image */
            new window.google.maps.Size(20, 20)
        );
        return <Marker key={stop.id} name={stop.name} position={{ lat: stop.latitude, lng: stop.longitude }} icon={stopIcon} />
    }

    displayTram(tram) {
        let tramIcon = new window.google.maps.MarkerImage(
            '/img/tram-r.svg',
            null, /* size is determined at runtime */
            null, /* origin is 0,0 */
            null, /* anchor is bottom center of the scaled image */
            new window.google.maps.Size(20, 20)
        );
        return <Marker key={tram.id} onClick={this.onMarkerClick} name={tram.name} position={{ lat: tram.latitude, lng: tram.longitude }} icon={tramIcon} />
    }

    render() {

        const style = {
            width: '100vw',
            height: '100vh'
        }

        if (!this.props.loaded) {
            return <div>Loading map...</div>
        }
        return (
            <div style={style}>
                <Map google={this.props.google} zoom={13} initialCenter={{ lat: 50.0613888889, lng: 19.9383333333 }} onClick={this.onMapClicked}>
                    {/* {this.props.stops.map((stop) => this.displayStop(stop))} */}
                    {this.props.trams.map((tram) => this.displayTram(tram))}
                    <InfoWindow
                        marker={this.state.activeMarker}
                        onClose={this.onInfoWindowClose}
                        visible={this.state.showingInfoWindow}>
                        <div>
                            <span>{this.state.selectedPlace.name}</span>
                        </div>
                    </InfoWindow>
                </Map>
            </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBlBEXT4Yu9pfyzWPw66EUVYkYgm8T3BRQ'
})(MapContainer)