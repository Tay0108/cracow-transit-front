import React, { Component } from 'react';
import { GoogleApiWrapper, Map } from 'google-maps-react';

export class Container extends Component {
    render() {

        const style = {
            width: '100vw',
            height: '100vh'
        }

        if (!this.props.loaded) {
            return <div>Loading...</div>
        }
        return (
            <div style={style}>
                <Map google={this.props.google} />
            </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBlBEXT4Yu9pfyzWPw66EUVYkYgm8T3BRQ'
})(Container)