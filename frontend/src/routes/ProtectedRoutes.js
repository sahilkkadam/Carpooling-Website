import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "../store/auth-context";

// This component acts as a wrapper around Route component to handle protected routes
const ProtectedRoute = ({ component: Component, ...otherProps }) => {
  const authCtx = useContext(AuthContext); // Accessing authentication context

  return (
    // Rendering a Route component with the spread props and a render function
    <Route
      {...otherProps}
      render={(props) =>
        // Checking if there is a token in local storage (user is authenticated)
        localStorage.getItem("token") ? (
          // If authenticated, render the provided component with its props
          <Component {...props} />
        ) : (
          // If not authenticated, redirect the user to the specified route (default is /login)
          <Redirect
            to={otherProps.redirectTo ? otherProps.redirectTo : "/login"}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;
