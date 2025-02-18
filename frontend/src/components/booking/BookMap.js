import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import pin from "../../utilites/MapPin2.png"; // Import custom pin icon
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet"; // Import components from react-leaflet library
import L from "leaflet"; // Import Leaflet library

const dummy = [
  [18.572384401114586, 73.9548040783595], // Dummy coordinates for testing
  [18.761783756004597, 73.42613684672403], // Dummy coordinates for testing
];

// Define custom icons for start and end markers
const iconStart = L.icon({
  iconUrl: pin,
  iconSize: [38, 38],
});
const iconEnd = L.icon({
  iconUrl:
    "https://cdn3.iconfinder.com/data/icons/location-pointer/100/map_pointer_pin_marker_location-02-512.png",
  iconSize: [38, 38],
});

const position = [20.5937, 78.9629]; // Default map position

// Custom hook to reset the map view to a specified pin location
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

// Custom hook to reset the map view to another specified pin location
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

// Functional component representing the BookMap
const BookMap = (props) => {
  const [routeCoordinates, setRouteCoordinates] = useState([]); // State to store route coordinates
  const [newPoints, setNewPoints] = useState([]); // State to store new points (not used in this code)

  // Effect to fetch route coordinates when pin locations change
  useEffect(() => {
    const startPoint = `${props.pin1?.lon},${props.pin1?.lat}`; // Start point coordinates
    const endPoint = `${props.pin2?.lon},${props.pin2?.lat}`; // End point coordinates

    // Fetch route coordinates from an API
    fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=YOUR_API_KEY&start=${startPoint}&end=${endPoint}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Extract coordinates from the API response
        const res = data.features[0].geometry.coordinates;
        const temp = res.map((e) => [e[1], e[0]]); // Convert coordinates format
        setRouteCoordinates(temp); // Update route coordinates state
      })
      .catch((err) => {
        console.error("Error fetching route coordinates:", err);
        setRouteCoordinates([]); // Reset route coordinates state in case of error
      });
  }, [props.pin1, props.pin2]); // Dependencies for the effect

  const l1 = [props.pin1?.lat, props.pin1?.lon]; // Start marker position
  const l2 = [props.pin2?.lat, props.pin2?.lon]; // End marker position

  return (
    <MapContainer
      center={position} // Center of the map
      zoom={8} // Initial zoom level
      scrollWheelZoom={true} // Enable zooming with mouse scroll wheel
      style={{ height: "100vh", width: "100%" }} // Styling for the map container
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=YOUR_API_KEY" // URL for the tile layer
      />
      {dummy && <Polyline positions={routeCoordinates} color="red" />} {/* Render polyline with route coordinates */}
      {props.pin1 && ( // Render start marker if pin1 exists
        <Marker position={l1} icon={iconStart}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      )}
      {props.pin2 && ( // Render end marker if pin2 exists
        <Marker position={l2} icon={iconEnd}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      )}
      {/* Use custom hooks to reset map view when pin1 or pin2 changes */}
      <ResetCenterView1 pin1={props.pin1} />
      <ResetCenterView2 pin2={props.pin2} />
    </MapContainer>
  );
};

export default BookMap; // Export the BookMap component
