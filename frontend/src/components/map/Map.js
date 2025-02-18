import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import pin from "../../utilites/MapPin2.png"; // Import custom pin icon
import live from "../../utilites/liveIcon.png"; // Import custom live icon
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet"; // Import components from react-leaflet
import L from "leaflet"; // Import Leaflet library

// Dummy coordinates for testing
const dummy = [
  [18.572384401114586, 73.9548040783595],
  [18.761783756004597, 73.42613684672403],
];

// Icon for end marker
const iconEnd = L.icon({
  iconUrl:
    "https://cdn3.iconfinder.com/data/icons/location-pointer/100/map_pointer_pin_marker_location-02-512.png",
  iconSize: [38, 38],
});

// Default position for map center
const position = [20.5937, 78.9629];

// Custom hook to reset map center for pin 1
function ResetCenterView1(props) {
  const { pin1 } = props;
  const map = useMap();

  useEffect(() => {
    if (pin1) {
      map.setView(L.latLng(pin1?.lat, pin1?.lon), map.getZoom(), {
        animate: true,
      });
    }
  }, [pin1]);

  return null;
}

// Custom hook to reset map center for pin 2
function ResetCenterView2(props) {
  const { pin2 } = props;
  const map = useMap();

  useEffect(() => {
    if (pin2) {
      map.setView(L.latLng(pin2?.lat, pin2?.lon), map.getZoom(), {
        animate: true,
      });
    }
  }, [pin2]);

  return null;
}

// Map component
const Map = (props) => {
  // Set icon based on the props
  const iconStart = L.icon({
    iconUrl: props.icon === "live" ? live : pin,
    iconSize: props.icon === "live" ? [18, 18] : [38, 38],
  });

  // State to store route coordinates
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  // Fetch route coordinates from the API
  useEffect(() => {
    const startPoint = `${props.pin1?.lon},${props.pin1?.lat}`;
    const endPoint = `${props.pin2?.lon},${props.pin2?.lat}`;

    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62481db6c45bb8e24388bce32349c3cbf3a1&start=${startPoint}&end=${endPoint}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        const res = JSON.parse(result).features[0].geometry.coordinates;
        var temp = [];
        res.map((e) => {
          var xy = [e[1], e[0]];
          temp.push(xy);
        });
        setRouteCoordinates(temp);
      })
      .catch((err) => {
        setRouteCoordinates([]);
      });
  }, [props.pin1, props.pin2]);

  // Coordinates for pin 1 and pin 2
  const l1 = [props.pin1?.lat, props.pin1?.lon];
  const l2 = [props.pin2?.lat, props.pin2?.lon];

  return (
    <MapContainer
      center={position}
      zoom={8}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=INhIiarNdRvjpXL4KRsE"
      />
      {/* Render route polyline if route coordinates are available */}
      {dummy && <Polyline positions={routeCoordinates} color="green" />}
      {/* Render pin 1 marker if pin 1 coordinates are available */}
      {props.pin1 && (
        <Marker position={l1} icon={iconStart}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      )}
      {/* Render pin 2 marker if pin 2 coordinates are available */}
      {props.pin2 && (
        <Marker position={l2} icon={iconEnd}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      )}
      {/* Reset map center for pin 1 */}
      <ResetCenterView1 pin1={props.pin1} />
      {/* Reset map center for pin 2 */}
      <ResetCenterView2 pin2={props.pin2} />
    </MapContainer>
  );
};

export default Map; // Export Map component
