import React, { useContext, useEffect, useState } from "react"; // Import React hooks
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Import icons
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"; // Import icons
import classes from "./Dropdown.module.css"; // Import CSS modules
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"; // Import icons
import { Link } from "react-router-dom"; // Import Link component from React Router
import AuthContext from "../../store/auth-context"; // Import AuthContext from context
import VerifiedIcon from "@mui/icons-material/Verified"; // Import icons
import axios from "axios"; // Import axios for making HTTP requests

const Dropdown = () => {
  const [login, setLogin] = useState(true); // State to manage login status
  const authCtx = useContext(AuthContext); // Access authentication context
  const [userInfo, setUserInfo] = useState(); // State to store user information

  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    axios
      .post("http://localhost:4000/getUserDetailById", { id: token }) // Send request to get user details by ID
      .then((res) => {
        setUserInfo(res.data); // Set user information in state
      })
      .catch((err) => {
        console.log(err); // Log error if request fails
      });
  }, []); // Run once on component mount

  const defaultImg =
    "https://img.wattpad.com/8f19b412f2223afe4288ed0904120a48b7a38ce1/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f5650722d38464e2d744a515349673d3d2d3234323931353831302e313434336539633161633764383437652e6a7067?s=fit&w=720&h=720"; // Default user image URL

  const close = "60px"; // Close height for dropdown
  const open = "200px"; // Open height for dropdown
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown open/close state

  return (
    <>
      {login && ( // Render dropdown only if user is logged in
        <div
          style={{
            height: `${isOpen ? open : close}`, // Set height based on dropdown state
          }}
          className={classes.outerBox} // Apply CSS class for outer box
        >
          <div className={classes.wrapper}> {/* Wrapper for dropdown */}
            <div
              className={classes.header} // Apply CSS class for header
              onClick={() => (isOpen ? setIsOpen(false) : setIsOpen(true))} // Toggle dropdown state on click
            >
              {userInfo?.isVerified && userInfo?.firstName && ( // Display verified icon if user is verified
                <span style={{ width: "10rem" }}>
                  {userInfo?.firstName + " " + userInfo?.lastName + " "}
                  <VerifiedIcon style={{ color: "#1976D2" }} />
                </span>
              )}
              {!userInfo?.isVerified && userInfo?.firstName && ( // Display user name if user is not verified
                <span style={{ width: "10rem" }}>
                  {userInfo?.firstName + " " + userInfo?.lastName}
                </span>
              )}
              <img // Display user image
                className={classes.dropdownLogo} // Apply CSS class for user image
                src={userInfo?.imgURL || defaultImg} // Set image source
              />
              {isOpen ? ( // Render arrow up/down icon based on dropdown state
                <KeyboardArrowUpIcon fontSize="large" />
              ) : (
                <KeyboardArrowDownIcon fontSize="large" />
              )}
            </div>
          </div>
          <ul style={{ paddingLeft: "0px" }}> {/* List for dropdown items */}
            <Link style={{ color: "black" }} to="/myRides"> {/* Link to My Rides page */}
              <li>My rides</li> {/* Dropdown item */}
            </Link>
            <Link style={{ color: "black" }} to="/profile"> {/* Link to Profile page */}
              <li>Profile</li> {/* Dropdown item */}
            </Link>
            <Link style={{ color: "black" }} to="/chatBox"> {/* Link to Inbox page */}
              <li>Inbox</li> {/* Dropdown item */}
            </Link>
            <li style={{ color: "black" }} onClick={authCtx.logout}> {/* Logout action */}
              Logout {/* Dropdown item */}
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Dropdown; // Export Dropdown component
