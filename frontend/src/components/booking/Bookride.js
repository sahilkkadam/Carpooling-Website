import axios from "axios"; // Import axios for making HTTP requests
import React, { useEffect, useState } from "react"; // Import React hooks
import BookMap from "./BookMap"; // Import BookMap component
import StarBorderIcon from "@mui/icons-material/StarBorder"; // Import icons
import PersonIcon from "@mui/icons-material/Person"; // Import icons
import classes from "./Bookride.module.css"; // Import CSS modules
import { MDBIcon } from "mdb-react-ui-kit"; // Import icons
import CloseIcon from "@mui/icons-material/Close"; // Import icons
import { Button } from "@mui/material"; // Import Button component from Material-UI

const Bookride = (props) => {
  const [driverInfo, setDriverInfo] = useState(); // State for storing driver information
  const [riderInfo, setRiderInfo] = useState(); // State for storing rider information
  const [tempData, setTempData] = useState(); // State for temporary data (not used)
  const defaultImg =
    "https://img.wattpad.com/8f19b412f2223afe4288ed0904120a48b7a38ce1/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f5650722d38464e2d744a515349673d3d2d3234323931353831302e313434336539633161633764383437652e6a7067?s=fit&w=720&h=720"; // Default image URL

  // Function to load driver and rider information on component start
  const loadOnStart = async () => {
    const driverId = props.data.driverId; // Extract driver ID from props
    const res = await axios.post("http://localhost:4000/getUserDetailById", {
      id: driverId,
    }); // Fetch driver information from server
    setDriverInfo(res.data); // Update driverInfo state with fetched data

    // If there are riders, fetch and set their information
    if (props.data.riders) {
      let data = [];
      for (let i = 0; i < props.data.riders.length; i++) {
        const riderId = props.data.riders[i];
        const res = await axios.post(
          "http://localhost:4000/getUserDetailById",
          {
            id: riderId,
          }
        );
        data.push(res.data);
      }
      setRiderInfo(data); // Update riderInfo state with fetched data
    }
  };

  useEffect(() => {
    loadOnStart(); // Load data on component start
  }, []); // Run only once on component mount

  // Function to handle closing the detail view
  const closeHandler = () => {
    props.setShowDetail(); // Call setShowDetail function to close the detail view
    setDriverInfo(); // Reset driverInfo state
    setRiderInfo(); // Reset riderInfo state
  };

  return (
    <div className={classes.column}> {/* Container for displaying driver and rider information */}
      <button onClick={closeHandler} className={classes.close}> {/* Button to close the detail view */}
        <CloseIcon fontSize="large" /> {/* Close icon */}
      </button>
      {driverInfo && ( // If driverInfo is available
        <> {/* Fragment */}
          <h2 className={classes.driverHeading}>Driver Details</h2> {/* Header for driver details */}
          <div className={classes.tripCard}> {/* Container for displaying driver details */}
            <div className={classes.box1}> {/* Container for driver image and bio */}
              <img
                src={driverInfo.imgURL || defaultImg} // Driver image URL
                className={classes.box2} // CSS class for driver image
              />
              <div className={classes.box3}> {/* Container for driver bio */}
                <p className={classes.brp1}> {/* Paragraph for displaying driver bio */}
                  <MDBIcon fas icon="quote-left" /> {driverInfo.bio + " "}
                  <MDBIcon fas icon="quote-right" />
                </p>
                <h2 className={classes.brh2}> {/* Header for driver name and age */}
                  {driverInfo.firstName + " " + driverInfo.lastName}
                  {" , " + calculateAge(driverInfo.dateOfBirth)}
                </h2>
                <p>{driverInfo.gender === "male" ? "Male" : "Female"}</p> {/* Display driver gender */}
              </div>
            </div>
            <p>Rides Completed : {driverInfo?.rideCompleted}</p> {/* Display completed rides count */}
          </div>
        </>
      )}
      <h2 className={classes.driverHeading}>Rider Details</h2> {/* Header for rider details */}
      {riderInfo && riderInfo.length > 0 && // If riderInfo is available and not empty
        riderInfo.map((e) => ( // Map through riderInfo array
          <>
            <div className={classes.tripCard}> {/* Container for displaying rider details */}
              <div className={classes.box1}> {/* Container for rider image and bio */}
                <img
                  src={e.imgURL || defaultImg} // Rider image URL
                  className={classes.box2} // CSS class for rider image
                />
                <div className={classes.box3}> {/* Container for rider bio */}
                  {e.bio && ( // If rider bio exists
                    <p className={classes.brp1}> {/* Paragraph for displaying rider bio */}
                      <MDBIcon fas icon="quote-left" /> {e.bio}
                      <MDBIcon fas icon="quote-right" />
                    </p>
                  )}
                  <h2 className={classes.brh2}> {/* Header for rider name and age */}
                    {e.firstName +
                      " " +
                      e.lastName +
                      " , " +
                      calculateAge(e.dateOfBirth)}
                  </h2>
                  <p>{e.gender === "male" ? "Male" : "Female"}</p> {/* Display rider gender */}
                </div>
              </div>
            </div>
          </>
        ))}
      {riderInfo && riderInfo.length == 0 && ( // If riderInfo is available and empty
        <p style={{ fontSize: "1.3rem" }} className={classes.driverHeading}>
          No rider travelling yet! {/* Display message */}
        </p>
      )}
    </div>
  );
};

export default Bookride; // Export Bookride component

// Function to calculate age from date of birth
const calculateAge = (userinput) => {
  if (!userinput) return ""; // If userinput is empty, return empty string
  var dob = new Date(userinput); // Create date object from userinput
  var month_diff = Date.now() - dob.getTime(); // Calculate difference in milliseconds
  var age_dt = new Date(month_diff); // Create date object from difference
  var year = age_dt.getUTCFullYear(); // Get year from date object
  var age = Math.abs(year - 1970); // Calculate age
  return age; // Return age
};
