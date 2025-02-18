import React, { useRef, useState } from "react";
import { TextField } from "@mui/material"; // Import TextField from Material-UI
import classes from "./Create.module.css";
import TimePicker from "react-time-picker";
import DatePicker from "react-date-picker";
import NumInp from "../../components/numberinput/NumInp";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useHistory } from "react-router-dom";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { useEffect } from "react";

// Base URL for Nominatim API
const nominatim_base_url = "https://nominatim.openstreetmap.org/search?";

const FindRide = (props) => {
  const [value, setValue] = useState(new Date("2017-05-24")); // State for date value
  const [searchtext, setSearchtext] = useState(""); // State for start location search text
  const [searchtext1, setSearchtext1] = useState(""); // State for end location search text
  const [listPlace, setListPlace] = useState([]); // State for list of start location search results
  const [listPlace1, setListPlace1] = useState([]); // State for list of end location search results
  const city = useRef(); // Reference for city input field
  const scity = useRef(); // Reference for start location input field
  const ecity = useRef(); // Reference for end location input field

  // Fetch start location search results
  useEffect(() => {
    if (searchtext.length > 3) {
      const params = {
        q: searchtext,
        format: "json",
        addressdetails: 1,
        polygon_geojson: 0,
      };
      const queryString = new URLSearchParams(params).toString();
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      fetch(`${nominatim_base_url}${queryString}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          setListPlace(JSON.parse(result));
        })
        .catch((err) => {});
    } else {
      setListPlace([]);
    }
  }, [searchtext]);

  // Fetch end location search results
  useEffect(() => {
    if (searchtext1.length > 3) {
      const params = {
        q: searchtext1,
        format: "json",
        addressdetails: 1,
        polygon_geojson: 0,
      };
      const queryString = new URLSearchParams(params).toString();
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      fetch(`${nominatim_base_url}${queryString}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          setListPlace1(JSON.parse(result));
        })
        .catch((err) => {});
    } else {
      setListPlace1([]);
    }
  }, [searchtext1]);

  // Handler to add start location to search field
  const addPlaceHandler = (place) => {
    setSearchtext(place.display_name);
    props.setPin1(place);
    setTimeout(() => {
      setListPlace([]);
    }, 800);
  };

  // Handler to add end location to search field
  const addPlaceHandler1 = (place) => {
    setSearchtext1(place.display_name);
    props.setPin2(place);
    setTimeout(() => {
      setListPlace1([]);
    }, 800);
  };

  // Handler to search for rides
  const searchRideHandler = async () => {
    var tcity = city.current.value;
    tcity = tcity.toLowerCase();
    const tdate = value;
    axios
      .post("http://localhost:4000/searchRides", {
        scity: tcity,
        datee: tdate,
        id: localStorage.getItem("token"),
      })
      .then((res) => {
        console.log(res.data);
        props.setSearchResult(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Initialize useHistory hook
  let history = useHistory();

  return (
    <div className={classes.outerBox}>
      <div className={classes.innerBox}>
        <h1 style={{ fontWeight: "bold" }}>Find Ride</h1>
        <div className={classes.wrapper}>
          <div style={{ display: "flex" }}>
            {/* Start Location TextField */}
            <TextField
              style={{ margin: "10px 10px" }}
              id="filled-basic"
              label="Start Location"
              variant="outlined"
              value={searchtext}
              ref={scity}
              onChange={(event) => setSearchtext(event.target.value)}
            />
            {/* Start City TextField */}
            <TextField
              style={{ margin: "10px 10px" }}
              id="filled-basic"
              label="Start city"
              variant="outlined"
              inputRef={city}
            />
            {/* List of Start Location Results */}
            <List
              style={{ position: "absolute", top: "9rem" }}
              className={classes.listitems}
            >
              {listPlace &&
                listPlace.map((item) => {
                  return (
                    <div
                      key={item?.osm_id}
                      onClick={() => addPlaceHandler(item)}
                    >
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText primary={item?.display_name} />
                        </ListItemButton>
                      </ListItem>
                      <Divider />
                    </div>
                  );
                })}
            </List>
          </div>
          <div>
            {/* End Location TextField */}
            <TextField
              style={{ margin: "10px 10px" }}
              id="filled-basic"
              label="End Location"
              variant="outlined"
              ref={ecity}
              value={searchtext1}
              onChange={(event) => setSearchtext1(event.target.value)}
            />
            {/* List of End Location Results */}
            <List
              style={{ position: "absolute" }}
              className={classes.listitems}
            >
              {listPlace1 &&
                listPlace1.map((item) => {
                  return (
                    <div
                      key={item?.osm_id}
                      onClick={() => addPlaceHandler1(item)}
                    >
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText primary={item?.display_name} />
                        </ListItemButton>
                      </ListItem>
                      <Divider />
                    </div>
                  );
                })}
            </List>
          </div>
        </div>
        <div className={classes.timedate}>
          {/* Date Picker */}
          <TextField
            id="date"
            type="date"
            onChange={(date) => {
              setValue(date.target.value);
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {/* Number Input Component */}
          <NumInp />
        </div>
        {/* Search Ride Button */}
        <button onClick={searchRideHandler} className={classes.btn}>
          Find Ride.
        </button>
      </div>
    </div>
  );
};

export default FindRide;
