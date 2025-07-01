/**
 * This component should contain logic to render route conditionally if the protected prop is
 * true in the routes list, if the user does not satisfy certain condition they will be
 * redirected to some default home or whatever the feature requests for.
 */
import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ fallbackRoute, ...route }) => {
  const user = window.localStorage.getItem("user");
  const validateRouteParams = (routeLink) => {
    if (routeLink && typeof routeLink !== "string") {
      throw new Error(
        `${typeof routeLink} is not an allowed type for fallbackRoute, it should be string only`
      );
    }
  };

  const renderRouteOrRedirect = (userObject) => {
    if (userObject) return <route.component routes={route.routes} />;
    return (
      <Redirect
        to={{
          pathname: fallbackRoute,
        }}
      />
    );
  };

  validateRouteParams(fallbackRoute);
  fallbackRoute = fallbackRoute || "/login";
  return (
    <Route
      render={(props) => {
        renderRouteOrRedirect(user);
      }}
    />
  );
};

export default ProtectedRoute;
