import React from "react";
import { Navigate, Route } from "react-router-dom";


const RouteAuth = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!sessionStorage.getItem("user");

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Navigate to="/login" />
      }
    />
  );
};

export default RouteAuth;
