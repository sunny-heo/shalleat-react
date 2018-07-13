const createMapOptions = maps => {
  // console.log("maps => ", maps);
  return {
    fullscreenControl: false,
    panControl: false,
    mapTypeControl: false,
    markerOptions: {
      visible: true,
      clickable: false
    },
    styles: [
      {
        featureType: "poi.business",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "landscape.man_made",
        elementType: "all",
        stylers: [
          {
            color: "#faf5ed"
          },
          {
            lightness: "0"
          },
          {
            gamma: "1"
          }
        ]
      },
      {
        featureType: "poi",
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "poi.park",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#bae5a6"
          }
        ]
      },
      {
        featureType: "road",
        elementType: "all",
        stylers: [
          {
            weight: "2.00"
          },
          {
            gamma: "1.8"
          },
          {
            saturation: "0"
          }
        ]
      },
      {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [
          {
            hue: "#ffb200"
          }
        ]
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.fill",
        stylers: [
          {
            lightness: "0"
          },
          {
            gamma: "1"
          }
        ]
      },
      {
        featureType: "transit.station.airport",
        elementType: "all",
        stylers: [
          {
            hue: "#b000ff"
          },
          {
            saturation: "23"
          },
          {
            lightness: "-4"
          },
          {
            gamma: "0.80"
          }
        ]
      },
      {
        featureType: "water",
        elementType: "all",
        stylers: [
          {
            color: "#a0daf2"
          }
        ]
      }
    ]
  };
};
export default createMapOptions;
