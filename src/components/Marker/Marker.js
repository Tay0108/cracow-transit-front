import React, {Component} from 'react';
import './marker.scss';

class Marker extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        

        return(
            <div>{this.props.latitude + ' ' + this.props.longitude}</div>
        );
    }
}

export default Marker;
