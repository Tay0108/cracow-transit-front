import React, { Component } from 'react';
import Marker from './components/Marker/Marker';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
    };
    this.callAPI = this.callAPI.bind(this);
  }

  componentDidMount() {
    //setInterval(()=> this.callAPI(), 10000)
  }

  callAPI() {
    fetch('http://localhost:8080/stopInfo/stops')
    .then(response => response.json())
    .then(stops => this.setState({stops: stops.stops}));
  }

  render() {

    function displayMarker(stop) {

      let latitude = stop.latitude / 1000 / 3600;
      let longitude = stop.longitude / 1000 / 3600;
  
      return <Marker latitude={latitude} longitude={longitude}/>
    }


    if(this.state.stops === undefined) {
      return ('pusto');
    }

  

    let stops = this.state.stops;

    return (
      <div className="App">
      {stops.map((stop) => displayMarker(stop))}
      </div>
    );
  }
}

export default App;
