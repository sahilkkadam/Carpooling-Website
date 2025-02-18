import axios from "axios"; // Import axios for making HTTP requests
import React, { useEffect, useState } from "react"; // Import React hooks
import RideResult from "../../ride res/RideResult"; // Import RideResult component
import classes from "./MyRides.module.css"; // Import CSS modules
import Navbar from "../../Navbar/Navbar"; // Import Navbar component
import PropTypes from "prop-types"; // Import PropTypes for type checking
import Tabs from "@mui/material/Tabs"; // Import Tabs component from Material-UI
import Tab from "@mui/material/Tab"; // Import Tab component from Material-UI
import Typography from "@mui/material/Typography"; // Import Typography component from Material-UI
import Box from "@mui/material/Box"; // Import Box component from Material-UI
import MyRidesList from "./MyRidesList"; // Import MyRidesList component
import Map from "../../map/Map"; // Import Map component
import geoLoc from "../../../hooks/UseGeoLocation"; // Import UseGeoLocation hook
import { Link, useHistory } from "react-router-dom"; // Import Link and useHistory from React Router
import CloseIcon from "@mui/icons-material/Close"; // Import CloseIcon from Material-UI
import Loader from "../../../UI/loader/Loader"; // Import Loader component

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MyRides = () => {
  const token = localStorage.getItem("token"); // Get token from local storage
  const [allRides, setAllRides] = useState([]); // State to store all rides
  const [value, setValue] = React.useState(0); // State to manage current tab value
  const [allOfferings, setAllOfferings] = useState(); // State to store all ride offerings
  const [location, setlocation] = useState(false); // State to manage location status
  const [isLoading, setIsLoading] = useState(false); // State to manage loading status
  const [coordinates, setCoordinates] = useState({ // State to manage coordinates
    x1: "",
    y1: "",
    liveLoc: {},
  });
  const [liveCoordinates, setLiveCoordinates] = useState({ lon: "", lat: "" }); // State to manage live coordinates

  useEffect(() => {
    if (navigator?.geolocation) { // Check if geolocation is supported by the browser
      navigator.geolocation.watchPosition((locn) => { // Watch for changes in position
        if (locn)
          setLiveCoordinates({ // Update live coordinates
            lon: locn.coords.longitude,
            lat: locn.coords.latitude,
          });
        if (location) { // If location is active, update live location
          updateLiveLocation();
        }
      });
    }
  }, []); // Run once on component mount

  const updateLiveLocation = async () => { // Function to update live location
    await axios.post("http://localhost:4000/updateLiveLocation", { // Send request to update live location
      id: token,
      coordinates: liveCoordinates,
    });
  };

  const handleChange = (event, newValue) => { // Handle tab change
    setValue(newValue); // Update tab value
  };

  const onLoadHandler = async () => { // Function to handle loading
    setIsLoading(true); // Set loading state to true
    const res = await axios.post("http://localhost:4000/getAllRiderRides", { // Get all rider rides
      id: token,
    });
    let allData = [];
    const docs = res.data;

    for (let i = 0; i < docs.length; i++) { // Loop through rider rides
      const res = await axios.post("http://localhost:4000/getAllRides", { // Get all rides
        id: docs[i],
      });
      if (res.data[0].driverId != token) allData.push(res.data[0]); // Filter rides based on driver ID
    }
    setAllRides(allData); // Set all rides
    const { data } = await axios.post( // Get ride details by ID
      "http://localhost:4000/getRideDetailById",
      {
        id: token,
      }
    );
    setIsLoading(false); // Set loading state to false
    setAllOfferings(data); // Set all offerings
  };

  const closeHandler = () => { // Function to handle closing location
    setlocation(false); // Set location state to false
  };

  useEffect(() => { // Run once on component mount
    onLoadHandler(); // Load data
  }, []);

  return (
    <>
      {!isLoading && (
        <>
          {location && ( // Render close button if location is active
            <div className={classes.closeBox}>
              <button onClick={closeHandler} className={classes.close}>
                Close <CloseIcon fontSize="large" />
              </button>
            </div>
          )}
          {!location && <Navbar />} {/* Render Navbar if location is not active */}
          {location && ( // Render Map component if location is active
            <Map
              pin1={coordinates.liveLoc}
              icon="live"
              pin2={{ lon: coordinates.x1, lat: coordinates.y1 }}
            />
          )}
          {!location && ( // Render rides list if location is not active
            <div className={classes.ridesBox}>
              <Box sx={{ borderBottom: 1, borderColor: "transparent" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab
                    style={{ fontWeight: "bold", fontSize: "18px" }}
                    label="Offered"
                    {...a11yProps(0)}
                  />
                  <Tab
                    style={{ fontWeight: "bold", fontSize: "18px" }}
                    label="Accepted"
                    {...a11yProps(1)}
                  />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <div className={classes.resBox}>
                  {allOfferings &&
                    allOfferings.length > 0 &&
                    allOfferings.map((e) => (
                      <MyRidesList
                        key={e._id}
                        type="driver"
                        setCoordinates={setCoordinates}
                        setlocation={setlocation}
                        id={e.driverId}
                        data={e}
                        startLocation={e.sLoc}
                        startTime={e.stime}
                        endLocation={e.eLoc}
                        endTime={e.etime}
                        seatsLeft={e.seats}
                      />
                    ))}
                  {allOfferings && allOfferings.length === 0 && ( // Render message if there are no offerings
                    <>
                      <h1
                        style={{
                          marginBottom: "1rem",
                          color: "#1e8449",
                        }}
                      >
                        Oops, you haven't been to any ride!!
                      </h1>
                      <h4>
                        <Link to="/ridesurf">Click here</Link> to Offer/Find
                        rides{" "}
                      </h4>
                    </>
                  )}
                </div>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <div className={classes.resBox}>
                  {allRides &&
                    allRides.map((e) => (
                      <MyRidesList
                        key={e._id}
                        type="rider"
                        setCoordinates={setCoordinates}
                        setlocation={setlocation}
                        id={e.driverId}
                        data={e}
                        startLocation={e.sLoc}
                        startTime={e.stime}
                        endLocation={e.eLoc}
                        endTime={e.etime}
                        seatsLeft={e.seats}
                      />
                    ))}
                  {allRides && allRides.length === 0 && ( // Render message if there are no rides
                    <>
                      <h1
                        style={{
                          marginBottom: "1rem",
                          color: "#1e8449",
                        }}
                      >
                        Oops, you haven't been to any ride!!
                      </h1>
                      <h4>
                        <Link to="/ridesurf">Click here</Link> to Offer/Find
                        rides{" "}
                      </h4>
                    </>
                  )}
                </div>
              </TabPanel>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default MyRides; // Export MyRides component
