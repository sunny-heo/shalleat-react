import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import { googleMapAPI } from "../../requests/configuration";
import CurrentMarker from "./CurrentMarker";
import RestaurantMarker from "./RestaurantMarker";
import CircularProgress from "../common/CircularProgress";
import Restaurant from "../../requests/restaurant";

class GoogleMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      currentLocation: null,
      center: null,
      zoom: 13,
      restaurants: [],
      radius: 500
    };
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  geoError() {
    alert("Geocoder failed.");
  }

  geoSuccess = position => {
    const { latitude: lat, longitude: lng } = position.coords;
    const currentLocation = { lat, lng };
    const center = currentLocation;
    const loading = false;

    this.setState(
      {
        loading,
        currentLocation,
        center
      },
      this.findNearby
    );
  };

  async findNearby() {
    const { currentLocation, radius } = this.state;
    const filters = { ...currentLocation, radius };

    try {
      const restaurants = await Restaurant.findNearby(filters);
      this.setState({
        restaurants
      });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.getLocation();
  }

  render() {
    const { loading, center, zoom, restaurants } = this.state;
    if (loading || restaurants.length === 0) {
      return <CircularProgress />;
    } else {
      const { results } = restaurants;
      // console.log(results);
      return (
        <div className="MapPage" style={{ height: "80vh", width: "100%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: googleMapAPI }}
            defaultCenter={center}
            defaultZoom={zoom}
          >
            <CurrentMarker lat={center.lat} lng={center.lng} text={"You"} />
            <RestaurantMarker
              lat={center.lat + 1}
              lng={center.lng + 1}
              name={"name"}
            />
            {results.map(r => {
              const { geometry, icon, name, place_id } = r;
              const { lat, lng } = geometry.location;
              return (
                <RestaurantMarker
                  lat={lat}
                  lng={lng}
                  icon={icon}
                  name={name}
                  key={place_id}
                />
              );
            })}
          </GoogleMapReact>
        </div>
      );
    }
  }
}

export default GoogleMap;